"""
convert_shp.py
Chuyển đổi file .shp sang .geojson
Không cần thư viện ngoài — chỉ dùng Python stdlib
Hỗ trợ: Point, PolyLine (LineString/MultiLineString), Polygon (Polygon/MultiPolygon)
"""
import struct, json, os, sys

# ============================================================
# ĐỌC FILE SHP
# ============================================================

SHAPE_TYPES = {
    0:  'Null',
    1:  'Point',
    3:  'PolyLine',
    5:  'Polygon',
    8:  'MultiPoint',
    11: 'PointZ',
    13: 'PolyLineZ',
    15: 'PolygonZ',
    21: 'PointM',
    23: 'PolyLineM',
    25: 'PolygonM',
}

def read_shp(path):
    """Đọc file .shp và trả về list geometry GeoJSON"""
    with open(path, 'rb') as f:
        data = f.read()

    # Header: 100 bytes
    # Bytes 0-3: file code (big-endian) = 9994
    file_code = struct.unpack_from('>i', data, 0)[0]
    if file_code != 9994:
        raise ValueError(f"Không phải file SHP hợp lệ (file_code={file_code})")

    # Bytes 32-35: shape type (little-endian)
    shape_type = struct.unpack_from('<i', data, 32)[0]
    print(f"  Shape type: {shape_type} ({SHAPE_TYPES.get(shape_type, 'Unknown')})")

    features = []
    offset = 100  # Bắt đầu đọc records sau header

    while offset < len(data):
        # Record header: 8 bytes
        # record_num (big-endian, 1-based)
        # content_length (big-endian, in 16-bit words)
        if offset + 8 > len(data):
            break

        record_num     = struct.unpack_from('>i', data, offset)[0]
        content_length = struct.unpack_from('>i', data, offset + 4)[0]
        offset += 8

        content_start = offset
        content_bytes = content_length * 2  # Convert words to bytes

        if offset + content_bytes > len(data):
            break

        # Shape type của record này (little-endian, 4 bytes)
        rec_shape_type = struct.unpack_from('<i', data, offset)[0]
        offset += 4

        geometry = None

        if rec_shape_type == 0:
            # Null shape
            geometry = None

        elif rec_shape_type == 1:
            # Point: X (8 bytes), Y (8 bytes)
            x = struct.unpack_from('<d', data, offset)[0]
            y = struct.unpack_from('<d', data, offset + 8)[0]
            geometry = {"type": "Point", "coordinates": [round(x, 7), round(y, 7)]}
            offset += 16

        elif rec_shape_type in (3, 5):
            # PolyLine (3) hoặc Polygon (5)
            # Bounding box: 4 doubles (32 bytes)
            offset += 32  # skip bbox

            num_parts  = struct.unpack_from('<i', data, offset)[0]; offset += 4
            num_points = struct.unpack_from('<i', data, offset)[0]; offset += 4

            # Parts array: num_parts integers
            parts = []
            for i in range(num_parts):
                parts.append(struct.unpack_from('<i', data, offset)[0])
                offset += 4

            # Points array: num_points * 2 doubles
            all_points = []
            for i in range(num_points):
                x = struct.unpack_from('<d', data, offset)[0]
                y = struct.unpack_from('<d', data, offset + 8)[0]
                all_points.append([round(x, 7), round(y, 7)])
                offset += 16

            # Tách thành các rings/parts
            rings = []
            for i, start in enumerate(parts):
                end = parts[i + 1] if i + 1 < len(parts) else num_points
                rings.append(all_points[start:end])

            if rec_shape_type == 3:
                # PolyLine → LineString hoặc MultiLineString
                if len(rings) == 1:
                    geometry = {"type": "LineString", "coordinates": rings[0]}
                else:
                    geometry = {"type": "MultiLineString", "coordinates": rings}
            else:
                # Polygon → Polygon hoặc MultiPolygon
                # Phân biệt outer ring (clockwise) và inner ring (counter-clockwise)
                # Đơn giản: coi mỗi part là 1 ring của cùng 1 polygon
                if len(rings) == 1:
                    geometry = {"type": "Polygon", "coordinates": rings}
                else:
                    # Kiểm tra xem có phải MultiPolygon không
                    # Dùng signed area để phân biệt outer/inner ring
                    outer_rings = []
                    inner_rings = []
                    for ring in rings:
                        area = signed_area(ring)
                        if area >= 0:
                            outer_rings.append(ring)
                        else:
                            inner_rings.append(ring)

                    if len(outer_rings) <= 1:
                        geometry = {"type": "Polygon", "coordinates": rings}
                    else:
                        # MultiPolygon: mỗi outer ring là 1 polygon
                        polys = [[r] for r in outer_rings]
                        geometry = {"type": "MultiPolygon", "coordinates": polys}

        elif rec_shape_type in (13, 15):
            # PolyLineZ / PolygonZ — bỏ qua Z values, đọc như PolyLine/Polygon
            offset += 32  # skip bbox
            num_parts  = struct.unpack_from('<i', data, offset)[0]; offset += 4
            num_points = struct.unpack_from('<i', data, offset)[0]; offset += 4
            parts = [struct.unpack_from('<i', data, offset + i*4)[0] for i in range(num_parts)]
            offset += num_parts * 4
            all_points = []
            for i in range(num_points):
                x = struct.unpack_from('<d', data, offset)[0]
                y = struct.unpack_from('<d', data, offset + 8)[0]
                all_points.append([round(x, 7), round(y, 7)])
                offset += 16
            # Skip Z range + Z array + M range + M array
            offset += 16 + num_points * 8 + 16 + num_points * 8
            rings = []
            for i, start in enumerate(parts):
                end = parts[i + 1] if i + 1 < len(parts) else num_points
                rings.append(all_points[start:end])
            if rec_shape_type == 13:
                geometry = {"type": "LineString" if len(rings)==1 else "MultiLineString",
                            "coordinates": rings[0] if len(rings)==1 else rings}
            else:
                geometry = {"type": "Polygon", "coordinates": rings}

        else:
            # Shape type không hỗ trợ — bỏ qua, nhảy đến record tiếp theo
            offset = content_start + content_bytes
            continue

        # Nhảy đến đúng vị trí record tiếp theo
        offset = content_start + content_bytes

        feature = {
            "type": "Feature",
            "properties": {"id": record_num},
            "geometry": geometry
        }
        features.append(feature)

    return features


def signed_area(ring):
    """Tính diện tích có dấu của ring (shoelace formula)"""
    n = len(ring)
    area = 0.0
    for i in range(n):
        j = (i + 1) % n
        area += ring[i][0] * ring[j][1]
        area -= ring[j][0] * ring[i][1]
    return area / 2.0


def shp_to_geojson(shp_path, out_path):
    """Chuyển đổi file .shp sang .geojson"""
    print(f"Đang đọc: {shp_path}")
    features = read_shp(shp_path)
    print(f"  → {len(features)} features")

    geojson = {
        "type": "FeatureCollection",
        "crs": {"type": "name", "properties": {"name": "EPSG:4326"}},
        "features": features
    }

    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(geojson, f, ensure_ascii=False, separators=(',', ':'))

    size_kb = os.path.getsize(out_path) / 1024
    print(f"  → Đã lưu: {out_path} ({size_kb:.1f} KB)")
    return len(features)


# ============================================================
# CHẠY CHUYỂN ĐỔI
# ============================================================
if __name__ == '__main__':
    files = [
        ('webgis/data/UBNDBG.shp',  'webgis/data/UBNDBG.geojson'),
        ('webgis/data/hwBG.shp',    'webgis/data/hwBG.geojson'),
        ('webgis/data/waterBG.shp', 'webgis/data/waterBG.geojson'),
    ]

    total = 0
    errors = []
    for shp_path, out_path in files:
        if not os.path.exists(shp_path):
            print(f"❌ Không tìm thấy: {shp_path}")
            errors.append(shp_path)
            continue
        try:
            n = shp_to_geojson(shp_path, out_path)
            total += n
        except Exception as e:
            print(f"❌ Lỗi khi xử lý {shp_path}: {e}")
            errors.append(shp_path)

    print(f"\n{'='*50}")
    print(f"Hoàn thành: {len(files)-len(errors)}/{len(files)} file")
    print(f"Tổng features: {total}")
    if errors:
        print(f"Lỗi: {errors}")
