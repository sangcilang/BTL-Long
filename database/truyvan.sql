-- ============================================================
-- FILE: truyvan.sql
-- MỤC ĐÍCH: Tập hợp các truy vấn không gian (Spatial Query)
--           cho hệ thống WebGIS tỉnh Bắc Giang
-- YÊU CẦU: PostgreSQL + PostGIS đã cài đặt
--          Các bảng: bacgiang, truonghoc, giaothong đã có dữ liệu
-- ============================================================

-- ============================================================
-- TRUY VẤN CƠ BẢN 1: Lấy tất cả trường học
-- MỤC ĐÍCH: Hiển thị danh sách toàn bộ trường học trong tỉnh
--           Dùng cho layer WFS trên bản đồ
-- ============================================================
-- Truy vấn 1A: Lấy tất cả trường học, sắp xếp theo loại và tên
SELECT
    id,
    ten                                     AS ten_truong,
    loai                                    AS loai_truong,
    diachi,
    huyen,
    sdt,
    so_hoc_sinh,
    ST_X(geom)                              AS kinh_do,   -- Kinh độ (longitude)
    ST_Y(geom)                              AS vi_do,     -- Vĩ độ (latitude)
    ST_AsGeoJSON(geom)                      AS geojson    -- Xuất GeoJSON để dùng trong OpenLayers
FROM public.truonghoc
ORDER BY loai, ten;

-- Truy vấn 1B: Đếm số trường theo từng loại
SELECT
    loai                                    AS loai_truong,
    COUNT(*)                                AS so_luong,
    SUM(so_hoc_sinh)                        AS tong_hoc_sinh
FROM public.truonghoc
GROUP BY loai
ORDER BY so_luong DESC;

-- Truy vấn 1C: Lấy trường học theo loại cụ thể (ví dụ: THPT)
SELECT
    id,
    ten,
    loai,
    diachi,
    huyen,
    so_hoc_sinh,
    ST_AsText(geom)                         AS toa_do_wkt
FROM public.truonghoc
WHERE loai = 'THPT'
ORDER BY so_hoc_sinh DESC;

-- ============================================================
-- TRUY VẤN CƠ BẢN 2: Tìm huyện theo tên
-- MỤC ĐÍCH: Tìm kiếm và hiển thị thông tin một huyện cụ thể
--           Dùng cho chức năng tìm kiếm trên WebGIS
-- ============================================================
-- Truy vấn 2A: Tìm huyện theo tên chính xác
SELECT
    gid,
    name_2                                  AS ten_huyen,
    type_2                                  AS loai_don_vi,
    hasc_2                                  AS ma_hasc,
    population                              AS dan_so,
    ST_Area(geom::geography) / 1000000      AS dien_tich_km2,  -- Diện tích km²
    ST_AsGeoJSON(geom)                      AS geojson
FROM public.bacgiang
WHERE name_2 = 'Bắc Giang'                 -- Thay tên huyện cần tìm
ORDER BY name_2;

-- Truy vấn 2B: Tìm huyện theo tên gần đúng (ILIKE = không phân biệt hoa thường)
SELECT
    gid,
    name_2                                  AS ten_huyen,
    type_2                                  AS loai_don_vi,
    population                              AS dan_so,
    ROUND(CAST(ST_Area(geom::geography) / 1000000 AS numeric), 2) AS dien_tich_km2
FROM public.bacgiang
WHERE name_2 ILIKE '%Lạng%'               -- Tìm tất cả đơn vị có chứa "Lạng"
ORDER BY name_2;

-- Truy vấn 2C: Lấy tất cả huyện với thống kê diện tích và dân số
SELECT
    gid,
    name_2                                  AS ten_huyen,
    type_2                                  AS loai_don_vi,
    population                              AS dan_so,
    ROUND(CAST(ST_Area(geom::geography) / 1000000 AS numeric), 2) AS dien_tich_km2,
    ROUND(CAST(population / (ST_Area(geom::geography) / 1000000) AS numeric), 0) AS mat_do_dan_so
FROM public.bacgiang
WHERE population IS NOT NULL
ORDER BY dien_tich_km2 DESC;

-- ============================================================
-- TRUY VẤN NÂNG CAO 3: ST_Within — Trường học nằm trong huyện
-- MỤC ĐÍCH: Tìm tất cả trường học nằm trong ranh giới một huyện cụ thể
--           Ứng dụng: Thống kê giáo dục theo đơn vị hành chính
-- KẾT QUẢ: Danh sách trường học thuộc huyện được chỉ định
-- ============================================================
SELECT
    t.id,
    t.ten                                   AS ten_truong,
    t.loai                                  AS loai_truong,
    t.diachi,
    t.so_hoc_sinh,
    b.name_2                                AS ten_huyen,
    b.type_2                                AS loai_don_vi
FROM public.truonghoc t
JOIN public.bacgiang b
    ON ST_Within(t.geom, b.geom)            -- Điểm trường học nằm TRONG vùng huyện
WHERE b.name_2 = 'Bắc Giang'               -- Lọc theo tên huyện/TP cụ thể
ORDER BY t.loai, t.ten;

-- Biến thể: Đếm số trường học trong mỗi huyện
SELECT
    b.name_2                                AS ten_huyen,
    b.type_2                                AS loai_don_vi,
    COUNT(t.id)                             AS so_truong,
    SUM(t.so_hoc_sinh)                      AS tong_hoc_sinh,
    STRING_AGG(t.loai, ', ' ORDER BY t.loai) AS cac_loai_truong
FROM public.bacgiang b
LEFT JOIN public.truonghoc t
    ON ST_Within(t.geom, b.geom)
GROUP BY b.gid, b.name_2, b.type_2
ORDER BY so_truong DESC;

-- ============================================================
-- TRUY VẤN NÂNG CAO 4: ST_Intersects — Đường giao thông cắt qua huyện
-- MỤC ĐÍCH: Tìm tất cả tuyến đường đi qua một huyện cụ thể
--           Ứng dụng: Quản lý hạ tầng giao thông theo địa bàn
-- KẾT QUẢ: Danh sách đường giao thông có đường đi qua huyện chỉ định
-- ============================================================
SELECT
    g.id,
    g.tenduong                              AS ten_duong,
    g.loaiduong                             AS loai_duong,
    ROUND(CAST(g.chieudai AS numeric), 2)   AS chieu_dai_km,
    g.chatluong,
    g.so_lane,
    b.name_2                                AS ten_huyen
FROM public.giaothong g
JOIN public.bacgiang b
    ON ST_Intersects(g.geom, b.geom)        -- Đường CẮT QUA vùng huyện
WHERE b.name_2 = 'Bắc Giang'
ORDER BY g.loaiduong, g.tenduong;

-- Biến thể: Tổng chiều dài đường theo từng huyện
SELECT
    b.name_2                                AS ten_huyen,
    g.loaiduong                             AS loai_duong,
    COUNT(g.id)                             AS so_tuyen,
    ROUND(SUM(g.chieudai)::numeric, 2)      AS tong_chieu_dai_km
FROM public.bacgiang b
LEFT JOIN public.giaothong g
    ON ST_Intersects(g.geom, b.geom)
GROUP BY b.name_2, g.loaiduong
ORDER BY b.name_2, g.loaiduong;

-- ============================================================
-- TRUY VẤN NÂNG CAO 5: ST_DWithin — Trường học gần đường
-- MỤC ĐÍCH: Tìm trường học trong phạm vi 500m từ một tuyến đường
--           Ứng dụng: Phân tích khả năng tiếp cận giao thông
-- KẾT QUẢ: Trường học và khoảng cách thực tế đến đường gần nhất
-- ============================================================
SELECT
    t.id,
    t.ten                                   AS ten_truong,
    t.loai                                  AS loai_truong,
    t.diachi,
    g.tenduong                              AS duong_gan_nhat,
    g.loaiduong,
    ROUND(
        CAST(ST_Distance(t.geom::geography, g.geom::geography) AS numeric),
        0
    )                                       AS khoang_cach_m  -- Khoảng cách thực tế (mét)
FROM public.truonghoc t
JOIN public.giaothong g
    ON ST_DWithin(
        t.geom::geography,
        g.geom::geography,
        500                                 -- Bán kính 500 mét
    )
ORDER BY t.ten, khoang_cach_m;

-- Biến thể: Trường học KHÔNG có đường nào trong 1km (vùng khó tiếp cận)
SELECT
    t.id,
    t.ten                                   AS ten_truong,
    t.loai,
    t.huyen,
    t.diachi
FROM public.truonghoc t
WHERE NOT EXISTS (
    SELECT 1
    FROM public.giaothong g
    WHERE ST_DWithin(
        t.geom::geography,
        g.geom::geography,
        1000                                -- 1000 mét = 1km
    )
);

-- ============================================================
-- TRUY VẤN NÂNG CAO 6: ST_Buffer — Vùng đệm quanh trường học
-- MỤC ĐÍCH: Tạo vùng đệm 1km quanh mỗi trường học
--           Ứng dụng: Phân tích vùng phục vụ, quy hoạch trường học
-- KẾT QUẢ: Vùng đệm dạng polygon cho từng trường
-- ============================================================
SELECT
    t.id,
    t.ten                                   AS ten_truong,
    t.loai,
    t.huyen,
    -- Tạo vùng đệm 1000m (dùng geography để tính theo mét thực)
    ST_AsGeoJSON(
        ST_Buffer(t.geom::geography, 1000)::geometry
    )                                       AS vung_dem_1km_geojson,
    -- Diện tích vùng đệm (km²)
    ROUND(
        CAST(ST_Area(ST_Buffer(t.geom::geography, 1000)) / 1000000 AS numeric),
        4
    )                                       AS dien_tich_vung_dem_km2
FROM public.truonghoc t
ORDER BY t.loai, t.ten;

-- Biến thể: Đếm số trường học trong vùng đệm 2km của mỗi trường (trường gần nhau)
SELECT
    t1.ten                                  AS truong_goc,
    t1.loai,
    COUNT(t2.id) - 1                        AS so_truong_lan_can  -- Trừ 1 vì tính cả chính nó
FROM public.truonghoc t1
JOIN public.truonghoc t2
    ON ST_DWithin(t1.geom::geography, t2.geom::geography, 2000)  -- 2km
GROUP BY t1.id, t1.ten, t1.loai
ORDER BY so_truong_lan_can DESC;

-- ============================================================
-- TRUY VẤN NÂNG CAO 7: ST_Area — Diện tích và thống kê huyện
-- MỤC ĐÍCH: Tính diện tích chính xác và xếp hạng các huyện
--           Ứng dụng: Báo cáo thống kê hành chính
-- KẾT QUẢ: Bảng thống kê đầy đủ các huyện tỉnh Bắc Giang
-- ============================================================
SELECT
    gid,
    name_2                                  AS ten_huyen,
    type_2                                  AS loai_don_vi,
    hasc_2                                  AS ma_hasc,
    population                              AS dan_so,
    -- Diện tích tính bằng km² (dùng ::geography để chính xác hơn)
    ROUND(
        CAST(ST_Area(geom::geography) / 1000000 AS numeric),
        2
    )                                       AS dien_tich_km2,
    -- Mật độ dân số (người/km²)
    CASE
        WHEN ST_Area(geom::geography) > 0 AND population IS NOT NULL
        THEN ROUND(
            CAST(population / (ST_Area(geom::geography) / 1000000) AS numeric),
            1
        )
        ELSE NULL
    END                                     AS mat_do_dan_so,
    -- Chu vi ranh giới (km)
    ROUND(
        CAST(ST_Perimeter(geom::geography) / 1000 AS numeric),
        2
    )                                       AS chu_vi_km,
    -- Xếp hạng diện tích (lớn nhất = 1)
    RANK() OVER (ORDER BY ST_Area(geom::geography) DESC) AS xep_hang_dien_tich
FROM public.bacgiang
ORDER BY dien_tich_km2 DESC;

-- ============================================================
-- TRUY VẤN BONUS: Tổng hợp thống kê toàn tỉnh
-- MỤC ĐÍCH: Dashboard tổng quan cho WebGIS
-- ============================================================
SELECT
    'Tổng số huyện/TP'                      AS chi_tieu,
    COUNT(*)::TEXT                          AS gia_tri
FROM public.bacgiang
UNION ALL
SELECT
    'Tổng diện tích (km²)',
    ROUND(CAST(SUM(ST_Area(geom::geography)) / 1000000 AS numeric), 2)::TEXT
FROM public.bacgiang
UNION ALL
SELECT
    'Tổng dân số',
    TO_CHAR(SUM(population), 'FM999,999,999')
FROM public.bacgiang
WHERE population IS NOT NULL
UNION ALL
SELECT
    'Số trường học',
    COUNT(*)::TEXT
FROM public.truonghoc
UNION ALL
SELECT
    'Số tuyến đường',
    COUNT(*)::TEXT
FROM public.giaothong
UNION ALL
SELECT
    'Tổng chiều dài đường (km)',
    ROUND(SUM(chieudai)::numeric, 2)::TEXT
FROM public.giaothong;

-- ============================================================
-- KẾT THÚC FILE truyvan.sql
-- ============================================================
