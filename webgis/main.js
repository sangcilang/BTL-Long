/**
 * WebGIS Bắc Giang — main.js
 * Sử dụng dữ liệu GeoJSON nhúng trực tiếp (không cần GeoServer/WMS/WFS)
 * Chỉ cần mở index.html bằng Live Server là chạy được
 */

'use strict';

// ============================================================
// CẤU HÌNH CHUNG
// ============================================================
const BAC_GIANG_CENTER = [106.1943, 21.2731]; // Tọa độ trung tâm TP. Bắc Giang
const DEFAULT_ZOOM = 10;                       // Mức zoom mặc định

// ============================================================
// DỮ LIỆU GEOJSON NHÚNG — TRƯỜNG HỌC (20 điểm)
// ============================================================
const TRUONGHOC_GEOJSON = {
  "type": "FeatureCollection",
  "features": [
    {"type":"Feature","properties":{"id":1,"ten":"Trường THPT Ngô Sĩ Liên","loai":"THPT","diachi":"Số 2 Nguyễn Thị Minh Khai, TP. Bắc Giang","huyen":"TP. Bắc Giang","sdt":"0204.3854.123","so_hoc_sinh":1850},"geometry":{"type":"Point","coordinates":[106.1943,21.2731]}},
    {"type":"Feature","properties":{"id":2,"ten":"Trường THPT Bắc Giang","loai":"THPT","diachi":"Đường Hoàng Văn Thụ, TP. Bắc Giang","huyen":"TP. Bắc Giang","sdt":"0204.3854.456","so_hoc_sinh":1650},"geometry":{"type":"Point","coordinates":[106.1978,21.2698]}},
    {"type":"Feature","properties":{"id":3,"ten":"Trường THCS Lê Quý Đôn","loai":"THCS","diachi":"Phường Trần Phú, TP. Bắc Giang","huyen":"TP. Bắc Giang","sdt":"0204.3854.789","so_hoc_sinh":980},"geometry":{"type":"Point","coordinates":[106.1921,21.2756]}},
    {"type":"Feature","properties":{"id":4,"ten":"Trường Tiểu học Hoàng Văn Thụ","loai":"Tiểu học","diachi":"Phường Hoàng Văn Thụ, TP. Bắc Giang","huyen":"TP. Bắc Giang","sdt":"0204.3854.321","so_hoc_sinh":750},"geometry":{"type":"Point","coordinates":[106.1965,21.2712]}},
    {"type":"Feature","properties":{"id":5,"ten":"Trường Đại học Bắc Giang","loai":"Đại học","diachi":"Số 4 Lê Lợi, TP. Bắc Giang","huyen":"TP. Bắc Giang","sdt":"0204.3854.000","so_hoc_sinh":5200},"geometry":{"type":"Point","coordinates":[106.2012,21.2680]}},
    {"type":"Feature","properties":{"id":6,"ten":"Trường THPT Lạng Giang số 1","loai":"THPT","diachi":"TT. Vôi, Huyện Lạng Giang","huyen":"Lạng Giang","sdt":"0204.3861.100","so_hoc_sinh":1200},"geometry":{"type":"Point","coordinates":[106.2534,21.3012]}},
    {"type":"Feature","properties":{"id":7,"ten":"Trường THCS Lạng Giang","loai":"THCS","diachi":"TT. Vôi, Huyện Lạng Giang","huyen":"Lạng Giang","sdt":"0204.3861.200","so_hoc_sinh":820},"geometry":{"type":"Point","coordinates":[106.2498,21.2989]}},
    {"type":"Feature","properties":{"id":8,"ten":"Trường Tiểu học Thị trấn Vôi","loai":"Tiểu học","diachi":"TT. Vôi, Huyện Lạng Giang","huyen":"Lạng Giang","sdt":"0204.3861.300","so_hoc_sinh":560},"geometry":{"type":"Point","coordinates":[106.2512,21.3034]}},
    {"type":"Feature","properties":{"id":9,"ten":"Trường THPT Lục Nam","loai":"THPT","diachi":"TT. Đồi Ngô, Huyện Lục Nam","huyen":"Lục Nam","sdt":"0204.3862.100","so_hoc_sinh":1100},"geometry":{"type":"Point","coordinates":[106.3421,21.3156]}},
    {"type":"Feature","properties":{"id":10,"ten":"Trường THCS Đồi Ngô","loai":"THCS","diachi":"TT. Đồi Ngô, Huyện Lục Nam","huyen":"Lục Nam","sdt":"0204.3862.200","so_hoc_sinh":740},"geometry":{"type":"Point","coordinates":[106.3398,21.3178]}},
    {"type":"Feature","properties":{"id":11,"ten":"Trường THPT Yên Thế","loai":"THPT","diachi":"TT. Cầu Gồ, Huyện Yên Thế","huyen":"Yên Thế","sdt":"0204.3863.100","so_hoc_sinh":950},"geometry":{"type":"Point","coordinates":[106.0823,21.4234]}},
    {"type":"Feature","properties":{"id":12,"ten":"Trường THCS Cầu Gồ","loai":"THCS","diachi":"TT. Cầu Gồ, Huyện Yên Thế","huyen":"Yên Thế","sdt":"0204.3863.200","so_hoc_sinh":680},"geometry":{"type":"Point","coordinates":[106.0801,21.4256]}},
    {"type":"Feature","properties":{"id":13,"ten":"Trường THPT Hiệp Hòa số 1","loai":"THPT","diachi":"TT. Thắng, Huyện Hiệp Hòa","huyen":"Hiệp Hòa","sdt":"0204.3864.100","so_hoc_sinh":1300},"geometry":{"type":"Point","coordinates":[105.9234,21.3567]}},
    {"type":"Feature","properties":{"id":14,"ten":"Trường Tiểu học Thắng","loai":"Tiểu học","diachi":"TT. Thắng, Huyện Hiệp Hòa","huyen":"Hiệp Hòa","sdt":"0204.3864.200","so_hoc_sinh":620},"geometry":{"type":"Point","coordinates":[105.9256,21.3589]}},
    {"type":"Feature","properties":{"id":15,"ten":"Trường THPT Việt Yên số 1","loai":"THPT","diachi":"TT. Bích Động, Huyện Việt Yên","huyen":"Việt Yên","sdt":"0204.3865.100","so_hoc_sinh":1400},"geometry":{"type":"Point","coordinates":[106.0512,21.2934]}},
    {"type":"Feature","properties":{"id":16,"ten":"Trường THCS Bích Động","loai":"THCS","diachi":"TT. Bích Động, Huyện Việt Yên","huyen":"Việt Yên","sdt":"0204.3865.200","so_hoc_sinh":890},"geometry":{"type":"Point","coordinates":[106.0489,21.2956]}},
    {"type":"Feature","properties":{"id":17,"ten":"Trường THPT Tân Yên số 1","loai":"THPT","diachi":"TT. Cao Thượng, Huyện Tân Yên","huyen":"Tân Yên","sdt":"0204.3866.100","so_hoc_sinh":1050},"geometry":{"type":"Point","coordinates":[106.0934,21.3789]}},
    {"type":"Feature","properties":{"id":18,"ten":"Trường THPT Sơn Động số 1","loai":"THPT","diachi":"TT. An Châu, Huyện Sơn Động","huyen":"Sơn Động","sdt":"0204.3867.100","so_hoc_sinh":780},"geometry":{"type":"Point","coordinates":[106.8234,21.3456]}},
    {"type":"Feature","properties":{"id":19,"ten":"Trường THPT Lục Ngạn số 1","loai":"THPT","diachi":"TT. Chũ, Huyện Lục Ngạn","huyen":"Lục Ngạn","sdt":"0204.3868.100","so_hoc_sinh":1150},"geometry":{"type":"Point","coordinates":[106.5123,21.3678]}},
    {"type":"Feature","properties":{"id":20,"ten":"Trường THCS Chũ","loai":"THCS","diachi":"TT. Chũ, Huyện Lục Ngạn","huyen":"Lục Ngạn","sdt":"0204.3868.200","so_hoc_sinh":760},"geometry":{"type":"Point","coordinates":[106.5098,21.3701]}}
  ]
};

// ============================================================
// DỮ LIỆU GEOJSON NHÚNG — GIAO THÔNG (12 tuyến đường)
// ============================================================
const GIAOTHONG_GEOJSON = {
  "type": "FeatureCollection",
  "features": [
    {"type":"Feature","properties":{"id":1,"tenduong":"Quốc lộ 1A đoạn Bắc Giang","loaiduong":"Quốc lộ","chieudai":45.30,"chatluong":"Tốt","so_lane":4},"geometry":{"type":"LineString","coordinates":[[106.1234,21.1890],[106.1456,21.2234],[106.1678,21.2567],[106.1890,21.2890],[106.2012,21.3234],[106.2234,21.3567],[106.2456,21.3890]]}},
    {"type":"Feature","properties":{"id":2,"tenduong":"Quốc lộ 31","loaiduong":"Quốc lộ","chieudai":62.50,"chatluong":"Tốt","so_lane":2},"geometry":{"type":"LineString","coordinates":[[106.1943,21.2731],[106.2567,21.3012],[106.3234,21.3345],[106.4012,21.3567],[106.5123,21.3678],[106.6234,21.3890],[106.7345,21.4012],[106.8234,21.3456]]}},
    {"type":"Feature","properties":{"id":3,"tenduong":"Quốc lộ 37","loaiduong":"Quốc lộ","chieudai":38.70,"chatluong":"Trung bình","so_lane":2},"geometry":{"type":"LineString","coordinates":[[106.1943,21.2731],[106.1234,21.3234],[106.0567,21.3789],[105.9890,21.4234],[105.9234,21.4678]]}},
    {"type":"Feature","properties":{"id":4,"tenduong":"Tỉnh lộ 295","loaiduong":"Tỉnh lộ","chieudai":18.40,"chatluong":"Tốt","so_lane":2},"geometry":{"type":"LineString","coordinates":[[106.1943,21.2731],[106.1234,21.2890],[106.0567,21.2956],[105.9890,21.2934]]}},
    {"type":"Feature","properties":{"id":5,"tenduong":"Tỉnh lộ 293","loaiduong":"Tỉnh lộ","chieudai":22.60,"chatluong":"Tốt","so_lane":2},"geometry":{"type":"LineString","coordinates":[[106.1943,21.2731],[106.1012,21.3012],[106.0234,21.3234],[105.9567,21.3456],[105.9234,21.3567]]}},
    {"type":"Feature","properties":{"id":6,"tenduong":"Tỉnh lộ 398","loaiduong":"Tỉnh lộ","chieudai":28.90,"chatluong":"Trung bình","so_lane":2},"geometry":{"type":"LineString","coordinates":[[106.2534,21.3012],[106.2890,21.3123],[106.3234,21.3156],[106.3421,21.3156]]}},
    {"type":"Feature","properties":{"id":7,"tenduong":"Đường Lê Lợi","loaiduong":"Đường đô thị","chieudai":3.20,"chatluong":"Tốt","so_lane":4},"geometry":{"type":"LineString","coordinates":[[106.1834,21.2698],[106.1890,21.2712],[106.1943,21.2731],[106.2012,21.2756],[106.2067,21.2780]]}},
    {"type":"Feature","properties":{"id":8,"tenduong":"Đường Hoàng Văn Thụ","loaiduong":"Đường đô thị","chieudai":2.80,"chatluong":"Tốt","so_lane":4},"geometry":{"type":"LineString","coordinates":[[106.1890,21.2645],[106.1921,21.2678],[106.1965,21.2712],[106.2012,21.2745]]}},
    {"type":"Feature","properties":{"id":9,"tenduong":"Đường Yên Thế - Tân Yên","loaiduong":"Huyện lộ","chieudai":15.60,"chatluong":"Trung bình","so_lane":2},"geometry":{"type":"LineString","coordinates":[[106.0823,21.4234],[106.0934,21.4012],[106.0934,21.3789]]}},
    {"type":"Feature","properties":{"id":10,"tenduong":"Đường Lục Ngạn - Sơn Động","loaiduong":"Huyện lộ","chieudai":42.30,"chatluong":"Kém","so_lane":2},"geometry":{"type":"LineString","coordinates":[[106.5123,21.3678],[106.6012,21.3567],[106.7012,21.3456],[106.8234,21.3456]]}},
    {"type":"Feature","properties":{"id":11,"tenduong":"Cao tốc Hà Nội - Bắc Giang","loaiduong":"Cao tốc","chieudai":46.00,"chatluong":"Tốt","so_lane":6},"geometry":{"type":"LineString","coordinates":[[105.8234,21.1890],[105.9012,21.2123],[105.9890,21.2456],[106.0567,21.2678],[106.1234,21.2756],[106.1943,21.2731]]}},
    {"type":"Feature","properties":{"id":12,"tenduong":"Tỉnh lộ 292","loaiduong":"Tỉnh lộ","chieudai":16.80,"chatluong":"Tốt","so_lane":2},"geometry":{"type":"LineString","coordinates":[[106.1943,21.2731],[106.2123,21.2890],[106.2345,21.3012],[106.2534,21.3012]]}}
  ]
};

// ============================================================
// HÀM TẠO STYLE CHO LAYER TRƯỜNG HỌC
// ============================================================
/**
 * Trả về ol.style.Style dựa trên loại trường và mức zoom hiện tại
 * @param {ol.Feature} feature
 * @param {number} resolution
 * @returns {ol.style.Style}
 */
function styleTruonghoc(feature, resolution) {
  const loai = feature.get('loai') || '';
  const ten  = feature.get('ten')  || '';

  // Xác định màu sắc và kích thước theo loại trường
  let fillColor = '#95A5A6';
  let radius    = 8;
  let shape     = 'circle'; // circle | square | triangle | star

  switch (loai) {
    case 'Đại học':
      fillColor = '#8E44AD';
      radius    = 14;
      shape     = 'star';
      break;
    case 'THPT':
      fillColor = '#E74C3C';
      radius    = 12;
      shape     = 'circle';
      break;
    case 'THCS':
      fillColor = '#2980B9';
      radius    = 10;
      shape     = 'square';
      break;
    case 'Tiểu học':
      fillColor = '#27AE60';
      radius    = 10;
      shape     = 'triangle';
      break;
    default:
      fillColor = '#95A5A6';
      radius    = 8;
      shape     = 'circle';
  }

  // Tạo hình dạng điểm
  let imageStyle;
  if (shape === 'circle' || shape === 'star') {
    // Đại học dùng hình tròn lớn màu tím (RegularShape 5 cạnh = ngôi sao)
    if (shape === 'star') {
      imageStyle = new ol.style.RegularShape({
        fill:   new ol.style.Fill({ color: fillColor }),
        stroke: new ol.style.Stroke({ color: '#fff', width: 1.5 }),
        points: 5,
        radius:  radius,
        radius2: radius / 2,
        angle:   0
      });
    } else {
      imageStyle = new ol.style.Circle({
        radius: radius,
        fill:   new ol.style.Fill({ color: fillColor }),
        stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
      });
    }
  } else if (shape === 'square') {
    imageStyle = new ol.style.RegularShape({
      fill:   new ol.style.Fill({ color: fillColor }),
      stroke: new ol.style.Stroke({ color: '#fff', width: 1.5 }),
      points: 4,
      radius: radius,
      angle:  Math.PI / 4
    });
  } else if (shape === 'triangle') {
    imageStyle = new ol.style.RegularShape({
      fill:   new ol.style.Fill({ color: fillColor }),
      stroke: new ol.style.Stroke({ color: '#fff', width: 1.5 }),
      points: 3,
      radius: radius,
      angle:  0
    });
  }

  // Hiển thị nhãn tên trường khi zoom >= 12 (resolution <= ~9.5 m/px ở EPSG:3857)
  // resolution ~9.5 tương ứng zoom 12 trong EPSG:3857
  const showLabel = resolution <= 9.6;
  const textStyle = showLabel
    ? new ol.style.Text({
        text:         ten,
        font:         'bold 11px "Be Vietnam Pro", sans-serif',
        fill:         new ol.style.Fill({ color: '#222' }),
        stroke:       new ol.style.Stroke({ color: '#fff', width: 3 }),
        offsetY:      -(radius + 6),
        textAlign:    'center',
        overflow:     true
      })
    : undefined;

  return new ol.style.Style({
    image: imageStyle,
    text:  textStyle
  });
}

// ============================================================
// HÀM TẠO STYLE CHO LAYER GIAO THÔNG
// ============================================================
/**
 * Trả về ol.style.Style dựa trên loại đường và mức zoom hiện tại
 * @param {ol.Feature} feature
 * @param {number} resolution
 * @returns {ol.style.Style|ol.style.Style[]}
 */
function styleGiaothong(feature, resolution) {
  const loai    = feature.get('loaiduong') || '';
  const tenduong = feature.get('tenduong') || '';

  let strokeColor   = '#999999';
  let strokeWidth   = 2;
  let lineDash      = null;
  let outlineColor  = null;
  let outlineWidth  = null;

  switch (loai) {
    case 'Cao tốc':
      strokeColor  = '#FF4444';
      strokeWidth  = 5;
      break;
    case 'Quốc lộ':
      strokeColor  = '#FF8C00';
      strokeWidth  = 4;
      break;
    case 'Tỉnh lộ':
      strokeColor  = '#FFD700';
      strokeWidth  = 3;
      outlineColor = '#B8860B';
      outlineWidth = 4;
      break;
    case 'Đường đô thị':
      strokeColor  = '#AAAAAA';
      strokeWidth  = 2.5;
      break;
    case 'Huyện lộ':
      strokeColor  = '#2E7D32';
      strokeWidth  = 2;
      lineDash     = [8, 4];
      break;
    default:
      strokeColor  = '#999999';
      strokeWidth  = 2;
  }

  // Hiển thị nhãn tên đường khi zoom >= 11 (resolution <= ~19 m/px)
  const showLabel = resolution <= 19.1;
  const textStyle = showLabel
    ? new ol.style.Text({
        text:       tenduong,
        font:       '11px "Be Vietnam Pro", sans-serif',
        fill:       new ol.style.Fill({ color: '#333' }),
        stroke:     new ol.style.Stroke({ color: '#fff', width: 3 }),
        placement:  'line',
        overflow:   true
      })
    : undefined;

  // Tỉnh lộ cần 2 lớp stroke (viền ngoài + màu chính)
  if (outlineColor) {
    return [
      new ol.style.Style({
        stroke: new ol.style.Stroke({ color: outlineColor, width: outlineWidth })
      }),
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color:    strokeColor,
          width:    strokeWidth,
          lineDash: lineDash || undefined
        }),
        text: textStyle
      })
    ];
  }

  return new ol.style.Style({
    stroke: new ol.style.Stroke({
      color:    strokeColor,
      width:    strokeWidth,
      lineDash: lineDash || undefined
    }),
    text: textStyle
  });
}

// ============================================================
// KHỞI TẠO ỨNG DỤNG — bọc trong try/catch
// ============================================================
try {

  // ----------------------------------------------------------
  // 1. CÁC LỚP BẢN ĐỒ NỀN (Base Layers)
  // ----------------------------------------------------------

  // OpenStreetMap (mặc định)
  const layerOSM = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true
  });

  // Ảnh vệ tinh Esri
  const layerSatellite = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attributions: 'Tiles © Esri'
    }),
    visible: false
  });

  // Bản đồ địa hình OpenTopoMap
  const layerTopo = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attributions: '© OpenTopoMap contributors'
    }),
    visible: false
  });

  // ----------------------------------------------------------
  // 2. LAYER VECTOR — GIAO THÔNG
  // ----------------------------------------------------------
  const sourceTruonghoc = new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(TRUONGHOC_GEOJSON, {
      // Dữ liệu GeoJSON dùng EPSG:4326, bản đồ dùng EPSG:3857
      dataProjection:   'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
  });

  const vectorLayerTruonghoc = new ol.layer.Vector({
    source: sourceTruonghoc,
    style:  styleTruonghoc,
    zIndex: 20  // Hiển thị trên cùng
  });

  // ----------------------------------------------------------
  // 3. LAYER VECTOR — GIAO THÔNG
  // ----------------------------------------------------------
  const sourceGiaothong = new ol.source.Vector({
    features: new ol.format.GeoJSON().readFeatures(GIAOTHONG_GEOJSON, {
      dataProjection:   'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
  });

  const vectorLayerGiaothong = new ol.layer.Vector({
    source: sourceGiaothong,
    style:  styleGiaothong,
    zIndex: 10
  });

  // ----------------------------------------------------------
  // 4. POPUP OVERLAY
  // ----------------------------------------------------------
  const popupEl = document.getElementById('popup');

  const popupOverlay = new ol.Overlay({
    element:    popupEl,
    positioning: 'bottom-center',
    stopEvent:  true,
    offset:     [0, -10]
  });

  // ----------------------------------------------------------
  // 5. KHỞI TẠO BẢN ĐỒ
  // ----------------------------------------------------------
  const map = new ol.Map({
    target: 'map',
    layers: [
      layerOSM,
      layerSatellite,
      layerTopo,
      vectorLayerGiaothong,   // Giao thông bên dưới trường học
      vectorLayerTruonghoc
    ],
    overlays: [popupOverlay],
    view: new ol.View({
      center: ol.proj.fromLonLat(BAC_GIANG_CENTER),
      zoom:   DEFAULT_ZOOM
    }),
    controls: ol.control.defaults.defaults({
      zoom:        false,  // Tự làm nút zoom riêng
      attribution: true,
      rotate:      false
    })
  });

  // ----------------------------------------------------------
  // 6. ẨN LOADING OVERLAY SAU KHI BẢN ĐỒ RENDER XONG
  // ----------------------------------------------------------
  map.once('rendercomplete', function () {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.style.display = 'none'; }, 400);
    }
  });

  // ----------------------------------------------------------
  // 7. HIỂN THỊ TỌA ĐỘ VÀ ZOOM TRÊN THANH TRẠNG THÁI
  // ----------------------------------------------------------
  const coordDisplay = document.getElementById('coordDisplay');
  const zoomDisplay  = document.getElementById('zoomDisplay');

  // Cập nhật tọa độ khi di chuyển chuột
  map.on('pointermove', function (evt) {
    if (evt.dragging) return;
    const lonlat = ol.proj.toLonLat(evt.coordinate);
    const lon = lonlat[0].toFixed(5);
    const lat = lonlat[1].toFixed(5);
    if (coordDisplay) coordDisplay.textContent = `Tọa độ: ${lon}, ${lat}`;
  });

  // Cập nhật mức zoom khi thay đổi resolution
  map.getView().on('change:resolution', function () {
    const zoom = map.getView().getZoom();
    if (zoomDisplay) zoomDisplay.textContent = `Zoom: ${zoom ? zoom.toFixed(1) : '--'}`;
  });

  // Hiển thị zoom ban đầu
  if (zoomDisplay) zoomDisplay.textContent = `Zoom: ${DEFAULT_ZOOM}`;

  // ----------------------------------------------------------
  // 8. CHUYỂN ĐỔI BẢN ĐỒ NỀN (radio buttons)
  // ----------------------------------------------------------
  document.querySelectorAll('input[name="basemap"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      layerOSM.setVisible(this.value === 'osm');
      layerSatellite.setVisible(this.value === 'satellite');
      layerTopo.setVisible(this.value === 'topo');
    });
  });

  // ----------------------------------------------------------
  // 9. BẬT/TẮT LAYER QUA CHECKBOX
  // ----------------------------------------------------------

  // Checkbox trường học
  const cbTruonghoc = document.getElementById('layerTruonghoc');
  if (cbTruonghoc) {
    cbTruonghoc.addEventListener('change', function () {
      vectorLayerTruonghoc.setVisible(this.checked);
    });
  }

  // Checkbox giao thông
  const cbGiaothong = document.getElementById('layerGiaothong');
  if (cbGiaothong) {
    cbGiaothong.addEventListener('change', function () {
      vectorLayerGiaothong.setVisible(this.checked);
    });
  }

  // Checkbox hành chính (bacgiang) — không có layer vector, chỉ bỏ qua
  const cbBacgiang = document.getElementById('layerBacgiang');
  if (cbBacgiang) {
    cbBacgiang.addEventListener('change', function () {
      // Không có layer hành chính vector — hiển thị thông báo nhỏ
      if (!this.checked) {
        console.info('Layer hành chính chưa có dữ liệu GeoJSON.');
      }
    });
  }

  // ----------------------------------------------------------
  // 10. POPUP KHI CLICK VÀO ĐỐI TƯỢNG
  // ----------------------------------------------------------
  let selectedFeature = null; // Lưu feature đang được chọn để zoom

  map.on('singleclick', function (evt) {
    // Ưu tiên tìm trường học trước, sau đó giao thông
    let clickedFeature = null;
    let clickedLayer   = null;

    map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
      if (!clickedFeature) {
        clickedFeature = feature;
        clickedLayer   = layer;
      }
    }, {
      layerFilter: function (layer) {
        return layer === vectorLayerTruonghoc || layer === vectorLayerGiaothong;
      },
      hitTolerance: 6
    });

    if (!clickedFeature) {
      // Không click vào feature nào → ẩn popup
      popupEl.classList.add('hidden');
      popupOverlay.setPosition(undefined);
      selectedFeature = null;
      return;
    }

    selectedFeature = clickedFeature;

    // Xác định loại feature và tạo nội dung popup
    const props = clickedFeature.getProperties();
    let title   = '';
    let content = '';

    if (clickedLayer === vectorLayerTruonghoc) {
      // --- Popup trường học ---
      title = props.ten || 'Trường học';

      // Màu badge theo loại trường
      const badgeColors = {
        'Đại học':  '#8E44AD',
        'THPT':     '#E74C3C',
        'THCS':     '#2980B9',
        'Tiểu học': '#27AE60'
      };
      const badgeColor = badgeColors[props.loai] || '#95A5A6';

      content = `
        <table class="popup-table">
          <tr>
            <th>Loại trường</th>
            <td><span class="popup-badge" style="background:${badgeColor}">${props.loai || '--'}</span></td>
          </tr>
          <tr>
            <th>Địa chỉ</th>
            <td>${props.diachi || '--'}</td>
          </tr>
          <tr>
            <th>Huyện/TP</th>
            <td>${props.huyen || '--'}</td>
          </tr>
          <tr>
            <th>Điện thoại</th>
            <td>${props.sdt || '--'}</td>
          </tr>
          <tr>
            <th>Học sinh</th>
            <td>${props.so_hoc_sinh ? props.so_hoc_sinh.toLocaleString('vi-VN') + ' em' : '--'}</td>
          </tr>
        </table>`;

    } else if (clickedLayer === vectorLayerGiaothong) {
      // --- Popup giao thông ---
      title = props.tenduong || 'Tuyến đường';

      const roadBadgeColors = {
        'Cao tốc':      '#FF4444',
        'Quốc lộ':      '#FF8C00',
        'Tỉnh lộ':      '#B8860B',
        'Đường đô thị': '#888888',
        'Huyện lộ':     '#2E7D32'
      };
      const badgeColor = roadBadgeColors[props.loaiduong] || '#666';

      content = `
        <table class="popup-table">
          <tr>
            <th>Loại đường</th>
            <td><span class="popup-badge" style="background:${badgeColor}">${props.loaiduong || '--'}</span></td>
          </tr>
          <tr>
            <th>Chiều dài</th>
            <td>${props.chieudai ? props.chieudai.toFixed(1) + ' km' : '--'}</td>
          </tr>
          <tr>
            <th>Chất lượng</th>
            <td>${props.chatluong || '--'}</td>
          </tr>
          <tr>
            <th>Số làn xe</th>
            <td>${props.so_lane || '--'} làn</td>
          </tr>
        </table>`;
    }

    // Cập nhật nội dung popup
    document.getElementById('popupTitle').textContent   = title;
    document.getElementById('popupContent').innerHTML   = content;
    popupEl.classList.remove('hidden');

    // Đặt vị trí popup tại điểm click
    popupOverlay.setPosition(evt.coordinate);
  });

  // Đóng popup khi nhấn nút X
  const popupClose = document.getElementById('popupClose');
  if (popupClose) {
    popupClose.addEventListener('click', function () {
      popupEl.classList.add('hidden');
      popupOverlay.setPosition(undefined);
      selectedFeature = null;
    });
  }

  // Nút "Zoom đến" trong popup
  const popupZoomBtn = document.getElementById('popupZoom');
  if (popupZoomBtn) {
    popupZoomBtn.addEventListener('click', function () {
      if (!selectedFeature) return;
      const geom = selectedFeature.getGeometry();
      if (!geom) return;
      const extent = geom.getExtent();
      map.getView().fit(extent, {
        padding:  [80, 80, 80, 80],
        maxZoom:  15,
        duration: 600
      });
    });
  }

  // Nút "Chi tiết" trong popup — hiện tại chỉ log ra console
  const popupInfoBtn = document.getElementById('popupInfo');
  if (popupInfoBtn) {
    popupInfoBtn.addEventListener('click', function () {
      if (!selectedFeature) return;
      console.info('Chi tiết feature:', selectedFeature.getProperties());
    });
  }

  // ----------------------------------------------------------
  // 11. THANH CÔNG CỤ BẢN ĐỒ
  // ----------------------------------------------------------

  // Phóng to
  const btnZoomIn = document.getElementById('toolZoomIn');
  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', function () {
      const view = map.getView();
      view.animate({ zoom: view.getZoom() + 1, duration: 300 });
    });
  }

  // Thu nhỏ
  const btnZoomOut = document.getElementById('toolZoomOut');
  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', function () {
      const view = map.getView();
      view.animate({ zoom: view.getZoom() - 1, duration: 300 });
    });
  }

  // Về vị trí ban đầu
  const btnHome = document.getElementById('toolHome');
  if (btnHome) {
    btnHome.addEventListener('click', function () {
      map.getView().animate({
        center:   ol.proj.fromLonLat(BAC_GIANG_CENTER),
        zoom:     DEFAULT_ZOOM,
        duration: 600
      });
    });
  }

  // Toàn màn hình
  const btnFullscreen = document.getElementById('toolFullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', function () {
      const mapEl = document.getElementById('map');
      if (!document.fullscreenElement) {
        mapEl.requestFullscreen && mapEl.requestFullscreen();
        this.querySelector('i').className = 'fas fa-compress';
      } else {
        document.exitFullscreen && document.exitFullscreen();
        this.querySelector('i').className = 'fas fa-expand';
      }
    });
  }

  // In bản đồ
  const btnPrint = document.getElementById('toolPrint');
  if (btnPrint) {
    btnPrint.addEventListener('click', function () {
      window.print();
    });
  }

  // ----------------------------------------------------------
  // 12. CÔNG CỤ ĐO KHOẢNG CÁCH
  // ----------------------------------------------------------
  let measureInteraction = null;
  let isMeasuring        = false;

  const btnMeasure = document.getElementById('toolMeasure');
  if (btnMeasure) {
    btnMeasure.addEventListener('click', function () {
      if (isMeasuring) {
        // Tắt đo
        if (measureInteraction) {
          map.removeInteraction(measureInteraction);
          measureInteraction = null;
        }
        isMeasuring = false;
        this.classList.remove('active');
        return;
      }

      // Bật đo
      isMeasuring = true;
      this.classList.add('active');

      const measureSource = new ol.source.Vector();
      measureInteraction  = new ol.interaction.Draw({
        source: measureSource,
        type:   'LineString'
      });

      measureInteraction.on('drawend', function (evt) {
        const geom   = evt.feature.getGeometry();
        // Tính độ dài theo EPSG:4326 → chuyển sang km
        const coords = geom.getCoordinates();
        let totalM   = 0;
        for (let i = 1; i < coords.length; i++) {
          totalM += ol.sphere.getDistance(
            ol.proj.toLonLat(coords[i - 1]),
            ol.proj.toLonLat(coords[i])
          );
        }
        const km = (totalM / 1000).toFixed(2);
        alert(`Khoảng cách đo được: ${km} km`);

        // Tắt đo sau khi hoàn thành
        setTimeout(() => {
          map.removeInteraction(measureInteraction);
          measureInteraction = null;
          isMeasuring        = false;
          if (btnMeasure) btnMeasure.classList.remove('active');
        }, 100);
      });

      map.addInteraction(measureInteraction);
    });
  }

  // ----------------------------------------------------------
  // 13. SIDEBAR TOGGLE
  // ----------------------------------------------------------
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar       = document.getElementById('sidebar');
  const toggleIcon    = document.getElementById('toggleIcon');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.toggle('collapsed');
      if (toggleIcon) {
        toggleIcon.className = sidebar.classList.contains('collapsed')
          ? 'fas fa-chevron-right'
          : 'fas fa-chevron-left';
      }
      // Cập nhật lại kích thước bản đồ sau khi sidebar thay đổi
      setTimeout(() => map.updateSize(), 300);
    });
  }

  // ----------------------------------------------------------
  // 14. MODAL THÔNG TIN HỆ THỐNG
  // ----------------------------------------------------------
  const infoBtn      = document.getElementById('infoBtn');
  const infoModal    = document.getElementById('infoModal');
  const modalClose   = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('modalOverlay');

  function openModal()  { if (infoModal) infoModal.classList.remove('hidden'); }
  function closeModal() { if (infoModal) infoModal.classList.add('hidden'); }

  if (infoBtn)      infoBtn.addEventListener('click', openModal);
  if (modalClose)   modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  // ----------------------------------------------------------
  // 15. TÌM KIẾM — lọc trực tiếp từ dữ liệu GeoJSON nhúng
  // ----------------------------------------------------------
  const searchInput   = document.getElementById('searchInput');
  const searchBtn     = document.getElementById('searchBtn');
  const searchResults = document.getElementById('searchResults');

  /**
   * Thực hiện tìm kiếm trong dữ liệu GeoJSON nhúng
   * @param {string} keyword
   */
  function doSearch(keyword) {
    if (!keyword || keyword.trim() === '') {
      searchResults.classList.add('hidden');
      return;
    }

    const kw = keyword.trim().toLowerCase();
    const results = [];

    // Tìm trong trường học
    TRUONGHOC_GEOJSON.features.forEach(function (f) {
      const ten = (f.properties.ten || '').toLowerCase();
      if (ten.includes(kw)) {
        results.push({
          label:  f.properties.ten,
          sub:    f.properties.loai + ' — ' + f.properties.huyen,
          icon:   'fa-school',
          coords: f.geometry.coordinates, // [lon, lat]
          type:   'point'
        });
      }
    });

    // Tìm trong giao thông
    GIAOTHONG_GEOJSON.features.forEach(function (f) {
      const ten = (f.properties.tenduong || '').toLowerCase();
      if (ten.includes(kw)) {
        results.push({
          label:  f.properties.tenduong,
          sub:    f.properties.loaiduong + ' — ' + f.properties.chieudai + ' km',
          icon:   'fa-road',
          coords: f.geometry.coordinates, // [[lon,lat], ...]
          type:   'line'
        });
      }
    });

    // Hiển thị kết quả
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-result-item no-result">Không tìm thấy kết quả</div>';
    } else {
      searchResults.innerHTML = results.map(function (r, idx) {
        return `<div class="search-result-item" data-idx="${idx}">
          <i class="fas ${r.icon}"></i>
          <div class="result-text">
            <div class="result-name">${r.label}</div>
            <div class="result-sub">${r.sub}</div>
          </div>
        </div>`;
      }).join('');

      // Gắn sự kiện click cho từng kết quả
      searchResults.querySelectorAll('.search-result-item[data-idx]').forEach(function (el) {
        el.addEventListener('click', function () {
          const idx = parseInt(this.getAttribute('data-idx'));
          const r   = results[idx];

          if (r.type === 'point') {
            // Zoom đến điểm trường học
            map.getView().animate({
              center:   ol.proj.fromLonLat(r.coords),
              zoom:     14,
              duration: 600
            });
          } else {
            // Zoom đến extent của tuyến đường
            const lineCoords = r.coords.map(c => ol.proj.fromLonLat(c));
            const geom       = new ol.geom.LineString(lineCoords);
            map.getView().fit(geom.getExtent(), {
              padding:  [60, 60, 60, 60],
              maxZoom:  13,
              duration: 600
            });
          }

          searchResults.classList.add('hidden');
          if (searchInput) searchInput.value = r.label;
        });
      });
    }

    searchResults.classList.remove('hidden');
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      doSearch(searchInput ? searchInput.value : '');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') {
        doSearch(this.value);
      } else if (e.key === 'Escape') {
        searchResults.classList.add('hidden');
      } else {
        // Tìm kiếm tức thì khi gõ (debounce nhẹ)
        clearTimeout(searchInput._debounce);
        searchInput._debounce = setTimeout(() => doSearch(this.value), 300);
      }
    });

    // Ẩn kết quả khi click ra ngoài
    document.addEventListener('click', function (e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.add('hidden');
      }
    });
  }

  // ----------------------------------------------------------
  // 16. THỐNG KÊ — tính từ dữ liệu GeoJSON nhúng
  // ----------------------------------------------------------
  const statHuyen  = document.getElementById('statHuyen');
  const statTruong = document.getElementById('statTruong');
  const statDuong  = document.getElementById('statDuong');
  const statKm     = document.getElementById('statKm');

  if (statHuyen)  statHuyen.textContent  = '10'; // Cố định 10 huyện/TP
  if (statTruong) statTruong.textContent = TRUONGHOC_GEOJSON.features.length;
  if (statDuong)  statDuong.textContent  = GIAOTHONG_GEOJSON.features.length;

  // Tính tổng chiều dài đường
  const tongKm = GIAOTHONG_GEOJSON.features.reduce(function (sum, f) {
    return sum + (f.properties.chieudai || 0);
  }, 0);
  if (statKm) statKm.textContent = tongKm.toFixed(0);

  // ----------------------------------------------------------
  // 17. HÀM ĐIỀU KHIỂN OPACITY (export ra window)
  // ----------------------------------------------------------

  /**
   * Đặt độ trong suốt cho layer
   * @param {string} layerName - 'truonghoc' | 'giaothong' | 'bacgiang'
   * @param {number|string} value - 0..100
   */
  function setLayerOpacity(layerName, value) {
    const opacity = parseFloat(value) / 100;
    const valEl   = document.getElementById('opacity-val-' + layerName);
    if (valEl) valEl.textContent = Math.round(value) + '%';

    switch (layerName) {
      case 'truonghoc':
        vectorLayerTruonghoc.setOpacity(opacity);
        break;
      case 'giaothong':
        vectorLayerGiaothong.setOpacity(opacity);
        break;
      case 'bacgiang':
        // Không có layer hành chính — bỏ qua
        break;
      default:
        console.warn('setLayerOpacity: không tìm thấy layer', layerName);
    }
  }

  /**
   * Bật/tắt hiển thị thanh opacity
   * @param {string} layerName
   */
  function toggleLayerOpacity(layerName) {
    const ctrl = document.getElementById('opacity-' + layerName);
    if (ctrl) {
      ctrl.style.display = ctrl.style.display === 'block' ? 'none' : 'block';
    }
  }

  /**
   * Zoom đến extent của layer
   * @param {string} layerName - 'truonghoc' | 'giaothong' | 'bacgiang'
   */
  function zoomToLayer(layerName) {
    let extent = null;

    switch (layerName) {
      case 'truonghoc':
        extent = sourceTruonghoc.getExtent();
        break;
      case 'giaothong':
        extent = sourceGiaothong.getExtent();
        break;
      case 'bacgiang':
        // Zoom về toàn tỉnh Bắc Giang (bounding box xấp xỉ)
        extent = ol.proj.transformExtent(
          [105.80, 21.10, 106.90, 21.55],
          'EPSG:4326',
          'EPSG:3857'
        );
        break;
      default:
        console.warn('zoomToLayer: không tìm thấy layer', layerName);
        return;
    }

    if (extent && !ol.extent.isEmpty(extent)) {
      map.getView().fit(extent, {
        padding:  [60, 60, 60, 60],
        maxZoom:  14,
        duration: 700
      });
    }
  }

  // Export ra window để HTML inline onclick có thể gọi
  window.setLayerOpacity    = setLayerOpacity;
  window.toggleLayerOpacity = toggleLayerOpacity;
  window.zoomToLayer        = zoomToLayer;

  // ----------------------------------------------------------
  // 18. CURSOR KHI DI CHUỘT QUA FEATURE
  // ----------------------------------------------------------
  map.on('pointermove', function (evt) {
    if (evt.dragging) return;
    const hit = map.hasFeatureAtPixel(evt.pixel, {
      layerFilter: l => l === vectorLayerTruonghoc || l === vectorLayerGiaothong,
      hitTolerance: 4
    });
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
  });

  // ----------------------------------------------------------
  // 19. ĐỌC FILE SHAPEFILE (.shp) TRỰC TIẾP TRONG TRÌNH DUYỆT
  //     Dùng thư viện shapefile.js (đã include trong index.html)
  //     File SHP đặt trong thư mục webgis/data/
  // ----------------------------------------------------------

  // Lưu trữ các layer SHP để dùng trong toggle/opacity/zoom
  const shpLayers = {};

  /**
   * Đọc file .shp + .dbf bằng shpjs và thêm vào bản đồ
   * shpjs nhận URL (không có extension) → tự fetch cả .shp và .dbf
   * @param {string} baseUrl   - URL không có extension, VD: 'data/hwBG'
   * @param {string} layerKey  - Key lưu trong shpLayers
   * @param {ol.style.Style|Function} style
   * @param {number} zIndex
   * @param {string} checkboxId
   * @returns {Promise<ol.layer.Vector|null>}
   */
  async function loadShapefile(baseUrl, layerKey, style, zIndex, checkboxId) {
    try {
      // shpjs v6: shp(url_without_extension) → Promise<GeoJSON FeatureCollection>
      // Tự động fetch <url>.shp và <url>.dbf
      const geojson = await shp(baseUrl);

      // shp() trả về FeatureCollection hoặc mảng FeatureCollection
      const fc = Array.isArray(geojson) ? geojson[0] : geojson;

      if (!fc || !fc.features || fc.features.length === 0) {
        throw new Error('Không có feature nào trong file SHP');
      }

      console.log(`✅ ${layerKey}: ${fc.features.length} features`);

      // shpjs trả về WGS84 (EPSG:4326) → chuyển sang EPSG:3857 cho OpenLayers
      const olFeatures = new ol.format.GeoJSON().readFeatures(fc, {
        dataProjection:    'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });

      const source = new ol.source.Vector({ features: olFeatures });
      const layer  = new ol.layer.Vector({
        source:  source,
        style:   style,
        zIndex:  zIndex,
        visible: true
      });

      map.addLayer(layer);
      shpLayers[layerKey] = { layer, source };

      // Gắn checkbox toggle
      const cb = document.getElementById(checkboxId);
      if (cb) {
        cb.addEventListener('change', function () {
          layer.setVisible(this.checked);
        });
      }

      return layer;

    } catch (err) {
      console.error(`❌ Lỗi tải SHP [${layerKey}]:`, err.message);
      return null;
    }
  }

  // Style cho layer UBND (ranh giới hành chính từ SHP)
  const styleUBND = new ol.style.Style({
    fill:   new ol.style.Fill({ color: 'rgba(106, 27, 154, 0.08)' }),
    stroke: new ol.style.Stroke({
      color: '#6A1B9A',
      width: 2.5,
      lineDash: [6, 3]
    })
  });

  // Style cho layer Highway (đường giao thông từ SHP)
  const styleHighway = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#E65100',
      width: 2.5
    })
  });

  // Style cho layer Water (sông/hồ từ SHP)
  // Có thể là Polygon hoặc LineString tùy file
  function styleWater(feature) {
    const geomType = feature.getGeometry().getType();
    if (geomType === 'Polygon' || geomType === 'MultiPolygon') {
      return new ol.style.Style({
        fill:   new ol.style.Fill({ color: 'rgba(21, 101, 192, 0.25)' }),
        stroke: new ol.style.Stroke({ color: '#1565C0', width: 1.5 })
      });
    }
    // LineString (sông)
    return new ol.style.Style({
      stroke: new ol.style.Stroke({ color: '#1565C0', width: 2 })
    });
  }

  // Cập nhật trạng thái tải SHP
  const shpStatus = document.getElementById('shpLoadStatus');
  function updateShpStatus(msg, isError) {
    if (!shpStatus) return;
    shpStatus.innerHTML = isError
      ? `<i class="fas fa-exclamation-triangle" style="color:#E74C3C;"></i> ${msg}`
      : `<i class="fas fa-check-circle" style="color:#27AE60;"></i> ${msg}`;
  }

  // Tải 3 file SHP song song
  // shpjs nhận URL không có extension → tự fetch .shp + .dbf
  Promise.allSettled([
    loadShapefile('data/UBNDBG',  'ubnd',    styleUBND,    5,  'layerUBND'),
    loadShapefile('data/hwBG',    'highway', styleHighway, 8,  'layerHighway'),
    loadShapefile('data/waterBG', 'water',   styleWater,   6,  'layerWater')
  ]).then(function (results) {
    const loaded  = results.filter(r => r.status === 'fulfilled' && r.value).length;
    const failed  = results.length - loaded;

    if (failed === 0) {
      updateShpStatus(`Đã tải ${loaded}/3 layer SHP thành công`);
    } else if (loaded > 0) {
      updateShpStatus(`Tải ${loaded}/3 layer SHP (${failed} lỗi)`, false);
    } else {
      updateShpStatus('Không tải được file SHP. Kiểm tra thư mục data/', true);
    }

    // Cập nhật hàm setLayerOpacity và zoomToLayer để hỗ trợ SHP layers
    const origSetOpacity = window.setLayerOpacity;
    window.setLayerOpacity = function (layerName, value) {
      // Xử lý SHP layers
      if (shpLayers[layerName]) {
        const opacity = parseFloat(value) / 100;
        shpLayers[layerName].layer.setOpacity(opacity);
        const valEl = document.getElementById('opacity-val-' + layerName);
        if (valEl) valEl.textContent = Math.round(value) + '%';
        return;
      }
      // Fallback về hàm gốc
      origSetOpacity(layerName, value);
    };

    const origZoomTo = window.zoomToLayer;
    window.zoomToLayer = function (layerName) {
      if (shpLayers[layerName]) {
        const extent = shpLayers[layerName].source.getExtent();
        if (extent && !ol.extent.isEmpty(extent)) {
          map.getView().fit(extent, {
            padding:  [60, 60, 60, 60],
            maxZoom:  14,
            duration: 700
          });
        }
        return;
      }
      origZoomTo(layerName);
    };

    // Cập nhật cursor khi hover SHP layers
    map.on('pointermove', function (evt) {
      if (evt.dragging) return;
      const shpLayerList = Object.values(shpLayers).map(s => s.layer);
      const hit = map.hasFeatureAtPixel(evt.pixel, {
        layerFilter: l => shpLayerList.includes(l),
        hitTolerance: 4
      });
      if (hit) map.getTargetElement().style.cursor = 'pointer';
    });

    // Click vào SHP features → hiện popup
    map.on('singleclick', function (evt) {
      const shpLayerList = Object.values(shpLayers).map(s => s.layer);
      let shpFeature = null;
      let shpLayerKey = null;

      map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        if (!shpFeature && shpLayerList.includes(layer)) {
          shpFeature = feature;
          // Tìm key của layer
          for (const [key, val] of Object.entries(shpLayers)) {
            if (val.layer === layer) { shpLayerKey = key; break; }
          }
        }
      }, { hitTolerance: 6 });

      if (!shpFeature) return;

      // Tạo popup cho SHP feature
      const props = shpFeature.getProperties();
      // Lọc bỏ geometry khỏi props
      const displayProps = Object.entries(props)
        .filter(([k]) => k !== 'geometry')
        .slice(0, 8); // Hiện tối đa 8 thuộc tính

      const layerLabels = {
        ubnd:    'Ranh giới UBND',
        highway: 'Đường giao thông',
        water:   'Sông/Hồ'
      };

      const titleEl   = document.getElementById('popupTitle');
      const contentEl = document.getElementById('popupContent');
      if (!titleEl || !contentEl) return;

      titleEl.textContent = layerLabels[shpLayerKey] || 'Đối tượng SHP';

      if (displayProps.length === 0) {
        contentEl.innerHTML = '<p style="color:#64748B;font-size:12px;">Không có thuộc tính</p>';
      } else {
        contentEl.innerHTML = `
          <table class="popup-table">
            ${displayProps.map(([k, v]) =>
              `<tr><th>${k}</th><td>${v !== null && v !== undefined ? v : '--'}</td></tr>`
            ).join('')}
          </table>`;
      }

      popupEl.classList.remove('hidden');
      popupOverlay.setPosition(evt.coordinate);
    });

  });



// ============================================================
// KẾT THÚC try/catch
// ============================================================
} catch (err) {
  console.error('Lỗi khởi tạo WebGIS Bắc Giang:', err);
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.innerHTML = `
      <div class="loading-spinner" style="color:#e74c3c;">
        <i class="fas fa-exclamation-triangle"></i>
        <span>Lỗi tải bản đồ: ${err.message}</span>
      </div>`;
  }
}
