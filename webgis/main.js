/* ============================================================
   FILE: main.js
   MỤC ĐÍCH: Logic chính cho ứng dụng WebGIS Bắc Giang
   CÔNG NGHỆ: OpenLayers 9
   TÁC GIẢ: WebGIS Bắc Giang Team
   ============================================================ */

'use strict';

/* ============================================================
   CẤU HÌNH TOÀN CỤC — Thay đổi URL GeoServer tại đây
   ============================================================ */
const GEOSERVER_URL = 'http://localhost:8080/geoserver';
const WORKSPACE     = 'bacgiang';
const WMS_URL       = `${GEOSERVER_URL}/${WORKSPACE}/wms`;
const WFS_URL       = `${GEOSERVER_URL}/${WORKSPACE}/wfs`;

// Tọa độ trung tâm tỉnh Bắc Giang (kinh độ, vĩ độ — WGS84)
const BAC_GIANG_CENTER = [106.1943, 21.2731];
const DEFAULT_ZOOM     = 10;

/* ============================================================
   BIẾN TOÀN CỤC
   ============================================================ */
let map;                    // Đối tượng bản đồ chính
let popupOverlay;           // Overlay hiển thị popup
let currentFeatureCoord;    // Tọa độ đối tượng đang được chọn
let currentFeatureBbox;     // Bounding box đối tượng đang được chọn
let measureActive = false;  // Trạng thái công cụ đo
let measureSource;          // Nguồn dữ liệu đo
let measureLayer;           // Layer đo khoảng cách
let measureListener;        // Listener sự kiện đo

/* ============================================================
   KHỞI TẠO CÁC LỚP BẢN ĐỒ NỀN (BASE MAPS)
   ============================================================ */

// Lớp OpenStreetMap — bản đồ đường phố mặc định
const layerOSM = new ol.layer.Tile({
  source: new ol.source.OSM(),
  visible: true,
  properties: { name: 'osm' }
});

// Lớp ảnh vệ tinh Esri — ảnh vệ tinh độ phân giải cao
const layerSatellite = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attributions: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19
  }),
  visible: false,
  properties: { name: 'satellite' }
});

// Lớp địa hình OpenTopoMap — hiển thị địa hình, độ cao
const layerTopo = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attributions: 'Map data: © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: © <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17
  }),
  visible: false,
  properties: { name: 'topo' }
});

/* ============================================================
   KHỞI TẠO CÁC LỚP WMS TỪ GEOSERVER
   ============================================================ */

// Lớp ranh giới hành chính Bắc Giang (polygon)
const wmsLayerBacgiang = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    url: WMS_URL,
    params: {
      'LAYERS': `${WORKSPACE}:bacgiang`,
      'TILED': true,
      'FORMAT': 'image/png',
      'TRANSPARENT': true
    },
    ratio: 1,
    serverType: 'geoserver'
  }),
  opacity: 0.7,
  visible: true,
  properties: { name: 'bacgiang', title: 'Hành chính' }
});

// Lớp trường học (point)
const wmsLayerTruonghoc = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    url: WMS_URL,
    params: {
      'LAYERS': `${WORKSPACE}:truonghoc`,
      'TILED': true,
      'FORMAT': 'image/png',
      'TRANSPARENT': true
    },
    ratio: 1,
    serverType: 'geoserver'
  }),
  opacity: 1.0,
  visible: true,
  properties: { name: 'truonghoc', title: 'Trường học' }
});

// Lớp giao thông (line)
const wmsLayerGiaothong = new ol.layer.Image({
  source: new ol.source.ImageWMS({
    url: WMS_URL,
    params: {
      'LAYERS': `${WORKSPACE}:giaothong`,
      'TILED': true,
      'FORMAT': 'image/png',
      'TRANSPARENT': true
    },
    ratio: 1,
    serverType: 'geoserver'
  }),
  opacity: 1.0,
  visible: true,
  properties: { name: 'giaothong', title: 'Giao thông' }
});

// Ánh xạ tên layer → đối tượng layer WMS (dùng cho các hàm tiện ích)
const wmsLayers = {
  bacgiang:  wmsLayerBacgiang,
  truonghoc: wmsLayerTruonghoc,
  giaothong: wmsLayerGiaothong
};

/* ============================================================
   KHỞI TẠO POPUP OVERLAY
   ============================================================ */

// Lấy phần tử DOM của popup
const popupElement = document.getElementById('popup');

// Tạo overlay để đặt popup lên bản đồ tại vị trí click
popupOverlay = new ol.Overlay({
  element: popupElement,
  autoPan: {
    animation: { duration: 250 }
  },
  positioning: 'bottom-center',
  stopEvent: true,
  offset: [0, -12]
});

/* ============================================================
   KHỞI TẠO BẢN ĐỒ CHÍNH
   ============================================================ */
map = new ol.Map({
  target: 'map',
  // Thứ tự layer: base maps → WMS layers (từ dưới lên trên)
  layers: [
    layerOSM,
    layerSatellite,
    layerTopo,
    wmsLayerBacgiang,
    wmsLayerTruonghoc,
    wmsLayerGiaothong
  ],
  overlays: [popupOverlay],
  view: new ol.View({
    // Chuyển tọa độ WGS84 sang EPSG:3857 (hệ tọa độ mặc định của OL)
    center: ol.proj.fromLonLat(BAC_GIANG_CENTER),
    zoom: DEFAULT_ZOOM,
    minZoom: 7,
    maxZoom: 19
  }),
  // Ẩn các control mặc định để dùng toolbar tùy chỉnh
  controls: ol.control.defaults.defaults({
    zoom: false,
    rotate: false,
    attribution: true
  })
});

/* ============================================================
   ẨN LOADING OVERLAY SAU KHI BẢN ĐỒ TẢI XONG
   ============================================================ */
map.once('rendercomplete', function () {
  try {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
    }
  } catch (err) {
    console.error('Lỗi khi ẩn loading overlay:', err);
  }
});

// Dự phòng: ẩn loading sau 5 giây nếu sự kiện rendercomplete không kích hoạt
setTimeout(function () {
  try {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay && !loadingOverlay.classList.contains('hidden')) {
      loadingOverlay.classList.add('hidden');
    }
  } catch (err) {
    console.error('Lỗi khi ẩn loading overlay (timeout):', err);
  }
}, 5000);

/* ============================================================
   HIỂN THỊ TỌA ĐỘ KHI DI CHUYỂN CHUỘT
   ============================================================ */
map.on('pointermove', function (evt) {
  try {
    // Chuyển tọa độ từ EPSG:3857 sang WGS84 (lon/lat)
    const lonLat = ol.proj.toLonLat(evt.coordinate);
    const lon = lonLat[0].toFixed(5);
    const lat = lonLat[1].toFixed(5);
    const coordDisplay = document.getElementById('coordDisplay');
    if (coordDisplay) {
      coordDisplay.textContent = `Tọa độ: ${lon}°E, ${lat}°N`;
    }
  } catch (err) {
    console.error('Lỗi khi cập nhật tọa độ:', err);
  }
});

/* ============================================================
   HIỂN THỊ MỨC ZOOM KHI THAY ĐỔI
   ============================================================ */
map.getView().on('change:resolution', function () {
  try {
    const zoom = map.getView().getZoom();
    const zoomDisplay = document.getElementById('zoomDisplay');
    if (zoomDisplay) {
      zoomDisplay.textContent = `Zoom: ${zoom ? zoom.toFixed(1) : '---'}`;
    }
  } catch (err) {
    console.error('Lỗi khi cập nhật zoom:', err);
  }
});

// Cập nhật zoom lần đầu khi bản đồ sẵn sàng
map.once('postrender', function () {
  try {
    const zoom = map.getView().getZoom();
    const zoomDisplay = document.getElementById('zoomDisplay');
    if (zoomDisplay) {
      zoomDisplay.textContent = `Zoom: ${zoom ? zoom.toFixed(1) : '---'}`;
    }
  } catch (err) {
    console.error('Lỗi khi cập nhật zoom ban đầu:', err);
  }
});

/* ============================================================
   XỬ LÝ CLICK BẢN ĐỒ — GetFeatureInfo từ WMS
   ============================================================ */
map.on('singleclick', function (evt) {
  // Nếu đang ở chế độ đo, không xử lý click popup
  if (measureActive) return;

  try {
    // Lấy URL GetFeatureInfo cho từng layer WMS đang hiển thị
    const viewResolution = map.getView().getResolution();
    const coordinate = evt.coordinate;

    // Xác định layer WMS nào đang bật để query
    const activeLayers = [];
    if (wmsLayerBacgiang.getVisible())  activeLayers.push({ layer: wmsLayerBacgiang,  name: 'bacgiang'  });
    if (wmsLayerTruonghoc.getVisible()) activeLayers.push({ layer: wmsLayerTruonghoc, name: 'truonghoc' });
    if (wmsLayerGiaothong.getVisible()) activeLayers.push({ layer: wmsLayerGiaothong, name: 'giaothong' });

    if (activeLayers.length === 0) return;

    // Ưu tiên query theo thứ tự: truonghoc → giaothong → bacgiang
    const queryOrder = ['truonghoc', 'giaothong', 'bacgiang'];
    const orderedLayers = queryOrder
      .map(name => activeLayers.find(l => l.name === name))
      .filter(Boolean);

    // Thực hiện GetFeatureInfo tuần tự, dừng khi tìm thấy kết quả
    queryLayersSequentially(orderedLayers, coordinate, viewResolution, evt);

  } catch (err) {
    console.error('Lỗi khi xử lý click bản đồ:', err);
  }
});

/**
 * Query các layer WMS tuần tự, hiển thị popup cho layer đầu tiên có kết quả
 * @param {Array} layers - Danh sách layer cần query
 * @param {Array} coordinate - Tọa độ click (EPSG:3857)
 * @param {number} resolution - Độ phân giải hiện tại
 * @param {Object} evt - Sự kiện click
 */
async function queryLayersSequentially(layers, coordinate, resolution, evt) {
  for (const { layer, name } of layers) {
    try {
      const url = layer.getSource().getFeatureInfoUrl(
        coordinate,
        resolution,
        'EPSG:3857',
        {
          'INFO_FORMAT': 'application/json',
          'FEATURE_COUNT': 1
        }
      );

      if (!url) continue;

      const response = await fetch(url);
      if (!response.ok) continue;

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        currentFeatureCoord = coordinate;
        currentFeatureBbox = feature.bbox || null;
        showPopup(name, feature.properties, coordinate);
        return; // Dừng sau khi tìm thấy kết quả đầu tiên
      }
    } catch (err) {
      console.error(`Lỗi khi query layer ${name}:`, err);
    }
  }

  // Không tìm thấy đối tượng nào — đóng popup
  hidePopup();
}

/**
 * Hiển thị popup với thông tin đối tượng
 * @param {string} layerName - Tên layer ('bacgiang', 'truonghoc', 'giaothong')
 * @param {Object} props - Thuộc tính của đối tượng
 * @param {Array} coordinate - Tọa độ hiển thị popup
 */
function showPopup(layerName, props, coordinate) {
  try {
    const titleEl   = document.getElementById('popupTitle');
    const contentEl = document.getElementById('popupContent');
    const popupEl   = document.getElementById('popup');

    if (!titleEl || !contentEl || !popupEl) return;

    let title   = 'Thông tin';
    let content = '';

    if (layerName === 'bacgiang') {
      // Thông tin hành chính: tên huyện và dân số
      const name2      = props.name_2      || props.NAME_2      || 'Không rõ';
      const population = props.population  || props.POPULATION  || 'Không rõ';
      const type       = props.type_2      || props.TYPE_2      || '';
      title = `<i class="fas fa-map-marker-alt" style="color:#7B1FA2;margin-right:6px;"></i>${name2}`;
      content = `
        <table class="popup-table">
          <tr><td>Tên đơn vị</td><td><strong>${name2}</strong></td></tr>
          <tr><td>Loại</td><td><span class="popup-badge badge-huyen">${type || 'Hành chính'}</span></td></tr>
          <tr><td>Dân số</td><td>${formatNumber(population)} người</td></tr>
        </table>`;

    } else if (layerName === 'truonghoc') {
      // Thông tin trường học
      const ten          = props.ten          || props.TEN          || 'Không rõ';
      const loai         = props.loai         || props.LOAI         || '';
      const diachi       = props.diachi       || props.DIACHI       || '';
      const soHocSinh    = props.so_hoc_sinh  || props.SO_HOC_SINH  || '';
      title = `<i class="fas fa-school" style="color:#E65100;margin-right:6px;"></i>${ten}`;
      const badgeClass   = getBadgeClass(loai);
      content = `
        <table class="popup-table">
          <tr><td>Tên trường</td><td><strong>${ten}</strong></td></tr>
          <tr><td>Loại trường</td><td><span class="popup-badge ${badgeClass}">${loai || 'Không rõ'}</span></td></tr>
          <tr><td>Địa chỉ</td><td>${diachi || 'Không rõ'}</td></tr>
          <tr><td>Học sinh</td><td>${formatNumber(soHocSinh)} em</td></tr>
        </table>`;

    } else if (layerName === 'giaothong') {
      // Thông tin giao thông
      const tenduong  = props.tenduong  || props.TENDUONG  || 'Không rõ';
      const loaiduong = props.loaiduong || props.LOAIDUONG || '';
      const chieudai  = props.chieudai  || props.CHIEUDAI  || '';
      title = `<i class="fas fa-road" style="color:#1565C0;margin-right:6px;"></i>${tenduong}`;
      const badgeClass = getBadgeClassDuong(loaiduong);
      content = `
        <table class="popup-table">
          <tr><td>Tên đường</td><td><strong>${tenduong}</strong></td></tr>
          <tr><td>Loại đường</td><td><span class="popup-badge ${badgeClass}">${loaiduong || 'Không rõ'}</span></td></tr>
          <tr><td>Chiều dài</td><td>${chieudai ? formatNumber(chieudai) + ' km' : 'Không rõ'}</td></tr>
        </table>`;
    }

    // Cập nhật nội dung popup
    titleEl.innerHTML   = title;
    contentEl.innerHTML = content;

    // Hiển thị popup và đặt vị trí trên bản đồ
    popupEl.classList.remove('hidden');
    popupOverlay.setPosition(coordinate);

  } catch (err) {
    console.error('Lỗi khi hiển thị popup:', err);
  }
}

/** Ẩn popup */
function hidePopup() {
  try {
    const popupEl = document.getElementById('popup');
    if (popupEl) popupEl.classList.add('hidden');
    popupOverlay.setPosition(undefined);
    currentFeatureCoord = null;
    currentFeatureBbox  = null;
  } catch (err) {
    console.error('Lỗi khi ẩn popup:', err);
  }
}

/**
 * Trả về class CSS badge theo loại trường học
 * @param {string} loai - Loại trường
 * @returns {string} CSS class
 */
function getBadgeClass(loai) {
  if (!loai) return 'badge-huyen';
  const l = loai.toLowerCase();
  if (l.includes('đại học') || l.includes('dai hoc') || l.includes('cao đẳng')) return 'badge-daihoc';
  if (l.includes('thpt') || l.includes('trung học phổ thông'))                   return 'badge-thpt';
  if (l.includes('thcs') || l.includes('trung học cơ sở'))                       return 'badge-thcs';
  if (l.includes('tiểu học') || l.includes('tieu hoc'))                          return 'badge-tieuhoc';
  return 'badge-huyen';
}

/**
 * Trả về class CSS badge theo loại đường
 * @param {string} loai - Loại đường
 * @returns {string} CSS class
 */
function getBadgeClassDuong(loai) {
  if (!loai) return 'badge-dothi';
  const l = loai.toLowerCase();
  if (l.includes('cao tốc') || l.includes('cao toc'))   return 'badge-caotoc';
  if (l.includes('quốc lộ') || l.includes('quoc lo'))   return 'badge-quoclo';
  if (l.includes('tỉnh lộ') || l.includes('tinh lo'))   return 'badge-tinhlo';
  if (l.includes('huyện lộ') || l.includes('huyen lo')) return 'badge-huyenlo';
  if (l.includes('đô thị') || l.includes('do thi'))     return 'badge-dothi';
  return 'badge-dothi';
}

/**
 * Định dạng số có dấu phân cách hàng nghìn
 * @param {number|string} num - Số cần định dạng
 * @returns {string} Chuỗi số đã định dạng
 */
function formatNumber(num) {
  if (num === null || num === undefined || num === '') return 'Không rõ';
  const n = parseFloat(num);
  if (isNaN(n)) return String(num);
  return n.toLocaleString('vi-VN');
}

/* ============================================================
   ĐIỀU KHIỂN LAYER — Toggle hiển thị/ẩn layer WMS
   ============================================================ */

// Lắng nghe sự kiện thay đổi checkbox layer hành chính
document.getElementById('layerBacgiang').addEventListener('change', function () {
  try {
    wmsLayerBacgiang.setVisible(this.checked);
  } catch (err) {
    console.error('Lỗi khi toggle layer bacgiang:', err);
  }
});

// Lắng nghe sự kiện thay đổi checkbox layer trường học
document.getElementById('layerTruonghoc').addEventListener('change', function () {
  try {
    wmsLayerTruonghoc.setVisible(this.checked);
  } catch (err) {
    console.error('Lỗi khi toggle layer truonghoc:', err);
  }
});

// Lắng nghe sự kiện thay đổi checkbox layer giao thông
document.getElementById('layerGiaothong').addEventListener('change', function () {
  try {
    wmsLayerGiaothong.setVisible(this.checked);
  } catch (err) {
    console.error('Lỗi khi toggle layer giaothong:', err);
  }
});

/* ============================================================
   ĐIỀU KHIỂN BẢN ĐỒ NỀN — Chuyển đổi giữa OSM / Satellite / Topo
   ============================================================ */
document.querySelectorAll('input[name="basemap"]').forEach(function (radio) {
  radio.addEventListener('change', function () {
    try {
      const selected = this.value;
      // Ẩn tất cả base map, chỉ hiện cái được chọn
      layerOSM.setVisible(selected === 'osm');
      layerSatellite.setVisible(selected === 'satellite');
      layerTopo.setVisible(selected === 'topo');
    } catch (err) {
      console.error('Lỗi khi chuyển đổi bản đồ nền:', err);
    }
  });
});

/* ============================================================
   HÀM ĐIỀU KHIỂN ĐỘ TRONG SUỐT LAYER
   Được gọi từ HTML: oninput="setLayerOpacity('bacgiang', this.value)"
   ============================================================ */

/**
 * Đặt độ trong suốt cho layer WMS
 * @param {string} layerName - Tên layer ('bacgiang', 'truonghoc', 'giaothong')
 * @param {number|string} value - Giá trị 0–100
 */
function setLayerOpacity(layerName, value) {
  try {
    const layer = wmsLayers[layerName];
    if (!layer) {
      console.error(`Không tìm thấy layer: ${layerName}`);
      return;
    }
    const opacity = parseFloat(value) / 100;
    layer.setOpacity(opacity);

    // Cập nhật nhãn hiển thị phần trăm
    const valEl = document.getElementById(`opacity-val-${layerName}`);
    if (valEl) valEl.textContent = `${Math.round(value)}%`;
  } catch (err) {
    console.error(`Lỗi khi đặt opacity cho layer ${layerName}:`, err);
  }
}

/**
 * Hiện/ẩn thanh điều chỉnh độ trong suốt của layer
 * @param {string} layerName - Tên layer
 */
function toggleLayerOpacity(layerName) {
  try {
    const opacityDiv = document.getElementById(`opacity-${layerName}`);
    if (!opacityDiv) return;
    opacityDiv.classList.toggle('visible');
  } catch (err) {
    console.error(`Lỗi khi toggle opacity control cho layer ${layerName}:`, err);
  }
}

/* ============================================================
   HÀM ZOOM ĐẾN LAYER — Dùng WFS GetFeature để lấy extent
   ============================================================ */

/**
 * Zoom bản đồ đến phạm vi của một layer WMS
 * @param {string} layerName - Tên layer ('bacgiang', 'truonghoc', 'giaothong')
 */
async function zoomToLayer(layerName) {
  try {
    // Gọi WFS GetFeature với outputFormat JSON để lấy toàn bộ đối tượng
    const wfsUrl = new URL(WFS_URL);
    wfsUrl.searchParams.set('service',      'WFS');
    wfsUrl.searchParams.set('version',      '1.1.0');
    wfsUrl.searchParams.set('request',      'GetFeature');
    wfsUrl.searchParams.set('typeName',     `${WORKSPACE}:${layerName}`);
    wfsUrl.searchParams.set('outputFormat', 'application/json');
    wfsUrl.searchParams.set('maxFeatures',  '1');
    wfsUrl.searchParams.set('srsName',      'EPSG:4326');

    const response = await fetch(wfsUrl.toString());
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      console.warn(`Layer ${layerName} không có đối tượng nào.`);
      return;
    }

    // Lấy extent từ toàn bộ features bằng cách gọi WFS không giới hạn
    await zoomToLayerExtent(layerName);

  } catch (err) {
    console.error(`Lỗi khi zoom đến layer ${layerName}:`, err);
    // Fallback: zoom về trung tâm Bắc Giang
    map.getView().animate({
      center: ol.proj.fromLonLat(BAC_GIANG_CENTER),
      zoom: DEFAULT_ZOOM,
      duration: 800
    });
  }
}

/**
 * Tính extent thực tế của layer và zoom đến đó
 * @param {string} layerName - Tên layer
 */
async function zoomToLayerExtent(layerName) {
  try {
    // Dùng WMS GetCapabilities hoặc WFS bbox để lấy extent
    const wfsUrl = new URL(WFS_URL);
    wfsUrl.searchParams.set('service',      'WFS');
    wfsUrl.searchParams.set('version',      '1.1.0');
    wfsUrl.searchParams.set('request',      'GetFeature');
    wfsUrl.searchParams.set('typeName',     `${WORKSPACE}:${layerName}`);
    wfsUrl.searchParams.set('outputFormat', 'application/json');
    wfsUrl.searchParams.set('srsName',      'EPSG:4326');

    const response = await fetch(wfsUrl.toString());
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (!data.features || data.features.length === 0) return;

    // Tính extent bao phủ tất cả features
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    data.features.forEach(function (feature) {
      if (feature.bbox) {
        minX = Math.min(minX, feature.bbox[0]);
        minY = Math.min(minY, feature.bbox[1]);
        maxX = Math.max(maxX, feature.bbox[2]);
        maxY = Math.max(maxY, feature.bbox[3]);
      } else if (feature.geometry) {
        const coords = extractCoordinates(feature.geometry);
        coords.forEach(function (c) {
          minX = Math.min(minX, c[0]);
          minY = Math.min(minY, c[1]);
          maxX = Math.max(maxX, c[0]);
          maxY = Math.max(maxY, c[1]);
        });
      }
    });

    if (!isFinite(minX)) return;

    // Chuyển extent từ WGS84 sang EPSG:3857
    const extent = ol.proj.transformExtent(
      [minX, minY, maxX, maxY],
      'EPSG:4326',
      'EPSG:3857'
    );

    // Zoom đến extent với padding
    map.getView().fit(extent, {
      padding: [60, 60, 60, 60],
      duration: 800,
      maxZoom: 15
    });

  } catch (err) {
    console.error(`Lỗi khi tính extent layer ${layerName}:`, err);
  }
}

/**
 * Trích xuất tất cả tọa độ từ một geometry GeoJSON
 * @param {Object} geometry - Đối tượng geometry GeoJSON
 * @returns {Array} Mảng tọa độ [lon, lat]
 */
function extractCoordinates(geometry) {
  const coords = [];
  function recurse(arr) {
    if (!Array.isArray(arr)) return;
    if (typeof arr[0] === 'number') {
      coords.push(arr);
    } else {
      arr.forEach(recurse);
    }
  }
  if (geometry && geometry.coordinates) {
    recurse(geometry.coordinates);
  }
  return coords;
}

/* ============================================================
   THANH CÔNG CỤ BẢN ĐỒ
   ============================================================ */

// Nút Zoom In — phóng to bản đồ
document.getElementById('toolZoomIn').addEventListener('click', function () {
  try {
    const view = map.getView();
    const currentZoom = view.getZoom();
    view.animate({ zoom: currentZoom + 1, duration: 300 });
  } catch (err) {
    console.error('Lỗi khi zoom in:', err);
  }
});

// Nút Zoom Out — thu nhỏ bản đồ
document.getElementById('toolZoomOut').addEventListener('click', function () {
  try {
    const view = map.getView();
    const currentZoom = view.getZoom();
    view.animate({ zoom: currentZoom - 1, duration: 300 });
  } catch (err) {
    console.error('Lỗi khi zoom out:', err);
  }
});

// Nút Home — quay về vị trí ban đầu (trung tâm Bắc Giang)
document.getElementById('toolHome').addEventListener('click', function () {
  try {
    map.getView().animate({
      center: ol.proj.fromLonLat(BAC_GIANG_CENTER),
      zoom: DEFAULT_ZOOM,
      duration: 800
    });
  } catch (err) {
    console.error('Lỗi khi về vị trí ban đầu:', err);
  }
});

// Nút Fullscreen — chuyển sang chế độ toàn màn hình
document.getElementById('toolFullscreen').addEventListener('click', function () {
  try {
    const mapContainer = document.querySelector('.map-container');
    if (!document.fullscreenElement) {
      // Vào chế độ toàn màn hình
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen();
      } else if (mapContainer.webkitRequestFullscreen) {
        mapContainer.webkitRequestFullscreen();
      }
      this.querySelector('i').className = 'fas fa-compress';
      this.title = 'Thoát toàn màn hình';
    } else {
      // Thoát chế độ toàn màn hình
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      this.querySelector('i').className = 'fas fa-expand';
      this.title = 'Toàn màn hình';
    }
  } catch (err) {
    console.error('Lỗi khi chuyển toàn màn hình:', err);
  }
});

// Cập nhật icon khi thoát fullscreen bằng phím Esc
document.addEventListener('fullscreenchange', function () {
  try {
    const btn = document.getElementById('toolFullscreen');
    if (!btn) return;
    if (!document.fullscreenElement) {
      btn.querySelector('i').className = 'fas fa-expand';
      btn.title = 'Toàn màn hình';
    }
  } catch (err) {
    console.error('Lỗi khi xử lý fullscreenchange:', err);
  }
});

// Nút In bản đồ — mở hộp thoại in của trình duyệt
document.getElementById('toolPrint').addEventListener('click', function () {
  try {
    window.print();
  } catch (err) {
    console.error('Lỗi khi in bản đồ:', err);
  }
});

/* ============================================================
   CÔNG CỤ ĐO KHOẢNG CÁCH
   ============================================================ */

// Tạo layer vector để vẽ đường đo
measureSource = new ol.source.Vector();
measureLayer  = new ol.layer.Vector({
  source: measureSource,
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#FF6F00',
      width: 2,
      lineDash: [8, 4]
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 111, 0, 0.1)'
    }),
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({ color: '#FF6F00' }),
      stroke: new ol.style.Stroke({ color: '#FFF', width: 2 })
    })
  }),
  properties: { name: 'measure' }
});
map.addLayer(measureLayer);

// Nút đo khoảng cách — bật/tắt chế độ đo
document.getElementById('toolMeasure').addEventListener('click', function () {
  try {
    measureActive = !measureActive;
    this.classList.toggle('active', measureActive);

    if (measureActive) {
      // Bật chế độ đo — thêm interaction vẽ đường
      startMeasure();
      this.title = 'Dừng đo';
    } else {
      // Tắt chế độ đo — xóa đường đo
      stopMeasure();
      this.title = 'Đo khoảng cách';
    }
  } catch (err) {
    console.error('Lỗi khi toggle công cụ đo:', err);
  }
});

/** Bắt đầu chế độ đo khoảng cách */
function startMeasure() {
  try {
    measureSource.clear();

    const draw = new ol.interaction.Draw({
      source: measureSource,
      type: 'LineString',
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#FF6F00',
          width: 2,
          lineDash: [8, 4]
        }),
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({ color: '#FF6F00' }),
          stroke: new ol.style.Stroke({ color: '#FFF', width: 2 })
        })
      })
    });

    // Lưu tham chiếu để có thể xóa sau
    map._measureDraw = draw;
    map.addInteraction(draw);

    // Khi vẽ xong — hiển thị kết quả đo
    draw.on('drawend', function (evt) {
      try {
        const geom   = evt.feature.getGeometry();
        const length = ol.sphere.getLength(geom);
        const km     = (length / 1000).toFixed(2);
        const m      = Math.round(length);
        alert(`Khoảng cách đo được:\n${km} km (${m.toLocaleString('vi-VN')} m)`);
      } catch (err) {
        console.error('Lỗi khi tính khoảng cách:', err);
      }
    });

  } catch (err) {
    console.error('Lỗi khi bắt đầu đo:', err);
  }
}

/** Dừng chế độ đo khoảng cách */
function stopMeasure() {
  try {
    if (map._measureDraw) {
      map.removeInteraction(map._measureDraw);
      map._measureDraw = null;
    }
    measureSource.clear();
  } catch (err) {
    console.error('Lỗi khi dừng đo:', err);
  }
}

/* ============================================================
   POPUP — Nút đóng và zoom đến đối tượng
   ============================================================ */

// Nút đóng popup
document.getElementById('popupClose').addEventListener('click', function () {
  hidePopup();
});

// Nút zoom đến đối tượng trong popup
document.getElementById('popupZoom').addEventListener('click', function () {
  try {
    if (currentFeatureBbox) {
      // Zoom đến bounding box của đối tượng (tọa độ WGS84)
      const extent = ol.proj.transformExtent(
        currentFeatureBbox,
        'EPSG:4326',
        'EPSG:3857'
      );
      map.getView().fit(extent, {
        padding: [80, 80, 80, 80],
        duration: 800,
        maxZoom: 16
      });
    } else if (currentFeatureCoord) {
      // Fallback: zoom đến tọa độ click
      map.getView().animate({
        center: currentFeatureCoord,
        zoom: Math.max(map.getView().getZoom(), 14),
        duration: 800
      });
    }
  } catch (err) {
    console.error('Lỗi khi zoom đến đối tượng:', err);
  }
});

/* ============================================================
   SIDEBAR — Thu/mở bảng điều khiển bên trái
   ============================================================ */
document.getElementById('sidebarToggle').addEventListener('click', function () {
  try {
    const sidebar    = document.getElementById('sidebar');
    const toggleIcon = document.getElementById('toggleIcon');

    if (!sidebar || !toggleIcon) return;

    const isCollapsed = sidebar.classList.toggle('collapsed');

    // Đổi icon mũi tên theo trạng thái
    if (isCollapsed) {
      toggleIcon.className = 'fas fa-chevron-right';
      this.title = 'Mở bảng điều khiển';
    } else {
      toggleIcon.className = 'fas fa-chevron-left';
      this.title = 'Thu bảng điều khiển';
    }

    // Cập nhật kích thước bản đồ sau khi sidebar thay đổi
    setTimeout(function () {
      map.updateSize();
    }, 300);

  } catch (err) {
    console.error('Lỗi khi toggle sidebar:', err);
  }
});

/* ============================================================
   MODAL THÔNG TIN HỆ THỐNG
   ============================================================ */

// Nút mở modal thông tin
document.getElementById('infoBtn').addEventListener('click', function () {
  try {
    const modal = document.getElementById('infoModal');
    if (modal) modal.classList.remove('hidden');
  } catch (err) {
    console.error('Lỗi khi mở modal:', err);
  }
});

// Nút đóng modal (X)
document.getElementById('modalClose').addEventListener('click', function () {
  try {
    const modal = document.getElementById('infoModal');
    if (modal) modal.classList.add('hidden');
  } catch (err) {
    console.error('Lỗi khi đóng modal:', err);
  }
});

// Click vào overlay nền để đóng modal
document.getElementById('modalOverlay').addEventListener('click', function () {
  try {
    const modal = document.getElementById('infoModal');
    if (modal) modal.classList.add('hidden');
  } catch (err) {
    console.error('Lỗi khi đóng modal qua overlay:', err);
  }
});

// Đóng modal bằng phím Escape
document.addEventListener('keydown', function (evt) {
  if (evt.key === 'Escape') {
    try {
      const modal = document.getElementById('infoModal');
      if (modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
      }
      // Cũng đóng popup nếu đang mở
      hidePopup();
    } catch (err) {
      console.error('Lỗi khi xử lý phím Escape:', err);
    }
  }
});

/* ============================================================
   TÌM KIẾM — WFS GetFeature cho 3 layer
   ============================================================ */

// Biến lưu timeout debounce tìm kiếm
let searchTimeout = null;

/**
 * Thực hiện tìm kiếm WFS trên 3 layer
 * @param {string} keyword - Từ khóa tìm kiếm
 */
async function performSearch(keyword) {
  const resultsEl = document.getElementById('searchResults');
  if (!resultsEl) return;

  // Xóa kết quả cũ
  resultsEl.innerHTML = '';
  resultsEl.classList.add('hidden');

  const q = keyword.trim();
  if (q.length < 2) return;

  // Hiển thị trạng thái đang tìm
  resultsEl.innerHTML = '<div class="search-result-item"><span style="color:#64748B;font-size:12px;">Đang tìm kiếm...</span></div>';
  resultsEl.classList.remove('hidden');

  const allResults = [];

  // Tìm kiếm song song trên 3 layer
  const searches = [
    searchWFS('bacgiang',  'name_2',   q, 'huyen',  'Hành chính'),
    searchWFS('truonghoc', 'ten',      q, 'truong', 'Trường học'),
    searchWFS('giaothong', 'tenduong', q, 'duong',  'Giao thông')
  ];

  try {
    const results = await Promise.allSettled(searches);
    results.forEach(function (r) {
      if (r.status === 'fulfilled' && r.value) {
        allResults.push(...r.value);
      }
    });
  } catch (err) {
    console.error('Lỗi khi tìm kiếm:', err);
  }

  // Hiển thị kết quả
  resultsEl.innerHTML = '';

  if (allResults.length === 0) {
    resultsEl.innerHTML = '<div class="search-result-item"><span style="color:#64748B;font-size:12px;">Không tìm thấy kết quả nào.</span></div>';
    resultsEl.classList.remove('hidden');
    return;
  }

  allResults.forEach(function (item) {
    const div = document.createElement('div');
    div.className = 'search-result-item';
    div.innerHTML = `
      <span class="search-result-icon ${item.iconClass}">
        <i class="${item.icon}"></i>
      </span>
      <div class="search-result-text">
        <strong>${escapeHtml(item.name)}</strong>
        <small>${item.type}</small>
      </div>`;

    // Click vào kết quả — zoom đến đối tượng
    div.addEventListener('click', function () {
      try {
        if (item.bbox) {
          const extent = ol.proj.transformExtent(item.bbox, 'EPSG:4326', 'EPSG:3857');
          map.getView().fit(extent, {
            padding: [80, 80, 80, 80],
            duration: 800,
            maxZoom: 15
          });
        } else if (item.coord) {
          map.getView().animate({
            center: ol.proj.fromLonLat(item.coord),
            zoom: 14,
            duration: 800
          });
        }
        // Ẩn kết quả tìm kiếm
        resultsEl.classList.add('hidden');
        document.getElementById('searchInput').value = item.name;
      } catch (err) {
        console.error('Lỗi khi zoom đến kết quả tìm kiếm:', err);
      }
    });

    resultsEl.appendChild(div);
  });

  resultsEl.classList.remove('hidden');
}

/**
 * Tìm kiếm WFS cho một layer cụ thể
 * @param {string} layerName - Tên layer
 * @param {string} fieldName - Tên trường tìm kiếm
 * @param {string} keyword   - Từ khóa
 * @param {string} iconClass - CSS class cho icon
 * @param {string} typeLabel - Nhãn loại đối tượng
 * @returns {Promise<Array>} Mảng kết quả tìm kiếm
 */
async function searchWFS(layerName, fieldName, keyword, iconClass, typeLabel) {
  try {
    // Xây dựng filter CQL để tìm kiếm không phân biệt hoa thường
    const cqlFilter = `strToLowerCase(${fieldName}) LIKE '%${keyword.toLowerCase()}%'`;

    const wfsUrl = new URL(WFS_URL);
    wfsUrl.searchParams.set('service',      'WFS');
    wfsUrl.searchParams.set('version',      '1.1.0');
    wfsUrl.searchParams.set('request',      'GetFeature');
    wfsUrl.searchParams.set('typeName',     `${WORKSPACE}:${layerName}`);
    wfsUrl.searchParams.set('outputFormat', 'application/json');
    wfsUrl.searchParams.set('CQL_FILTER',   cqlFilter);
    wfsUrl.searchParams.set('maxFeatures',  '5');
    wfsUrl.searchParams.set('srsName',      'EPSG:4326');

    const response = await fetch(wfsUrl.toString());
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!data.features || data.features.length === 0) return [];

    // Ánh xạ icon theo loại layer
    const iconMap = {
      huyen:  'fas fa-map-marker-alt',
      truong: 'fas fa-school',
      duong:  'fas fa-road'
    };

    return data.features.map(function (feature) {
      const props = feature.properties || {};
      const name  = props[fieldName] || props[fieldName.toUpperCase()] || 'Không rõ';

      // Lấy tọa độ trung tâm từ geometry
      let coord = null;
      let bbox  = feature.bbox || null;

      if (feature.geometry) {
        const coords = extractCoordinates(feature.geometry);
        if (coords.length > 0) {
          // Tính trung tâm đơn giản
          const sumX = coords.reduce((s, c) => s + c[0], 0);
          const sumY = coords.reduce((s, c) => s + c[1], 0);
          coord = [sumX / coords.length, sumY / coords.length];
        }
      }

      return {
        name:      name,
        type:      typeLabel,
        iconClass: iconClass,
        icon:      iconMap[iconClass] || 'fas fa-map-pin',
        coord:     coord,
        bbox:      bbox
      };
    });

  } catch (err) {
    console.error(`Lỗi khi tìm kiếm WFS layer ${layerName}:`, err);
    return [];
  }
}

/**
 * Escape HTML để tránh XSS khi hiển thị kết quả tìm kiếm
 * @param {string} str - Chuỗi cần escape
 * @returns {string} Chuỗi đã escape
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

// Sự kiện click nút tìm kiếm
document.getElementById('searchBtn').addEventListener('click', function () {
  try {
    const keyword = document.getElementById('searchInput').value;
    performSearch(keyword);
  } catch (err) {
    console.error('Lỗi khi click nút tìm kiếm:', err);
  }
});

// Sự kiện nhập liệu — tìm kiếm tự động sau 400ms (debounce)
document.getElementById('searchInput').addEventListener('input', function () {
  try {
    clearTimeout(searchTimeout);
    const keyword = this.value;
    if (keyword.trim().length < 2) {
      const resultsEl = document.getElementById('searchResults');
      if (resultsEl) resultsEl.classList.add('hidden');
      return;
    }
    searchTimeout = setTimeout(function () {
      performSearch(keyword);
    }, 400);
  } catch (err) {
    console.error('Lỗi khi xử lý input tìm kiếm:', err);
  }
});

// Nhấn Enter trong ô tìm kiếm
document.getElementById('searchInput').addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    try {
      clearTimeout(searchTimeout);
      performSearch(this.value);
    } catch (err) {
      console.error('Lỗi khi tìm kiếm bằng Enter:', err);
    }
  }
});

// Ẩn kết quả tìm kiếm khi click ra ngoài
document.addEventListener('click', function (evt) {
  try {
    const searchBox     = document.querySelector('.search-box');
    const searchResults = document.getElementById('searchResults');
    if (!searchBox || !searchResults) return;
    if (!searchBox.contains(evt.target) && !searchResults.contains(evt.target)) {
      searchResults.classList.add('hidden');
    }
  } catch (err) {
    console.error('Lỗi khi ẩn kết quả tìm kiếm:', err);
  }
});

/* ============================================================
   CẬP NHẬT THỐNG KÊ — Đếm số đối tượng từ WFS
   ============================================================ */

/**
 * Lấy số lượng đối tượng của một layer từ WFS
 * @param {string} layerName - Tên layer
 * @returns {Promise<number>} Số lượng đối tượng
 */
async function getFeatureCount(layerName) {
  try {
    const wfsUrl = new URL(WFS_URL);
    wfsUrl.searchParams.set('service',      'WFS');
    wfsUrl.searchParams.set('version',      '1.1.0');
    wfsUrl.searchParams.set('request',      'GetFeature');
    wfsUrl.searchParams.set('typeName',     `${WORKSPACE}:${layerName}`);
    wfsUrl.searchParams.set('outputFormat', 'application/json');
    wfsUrl.searchParams.set('resultType',   'hits');

    const response = await fetch(wfsUrl.toString());
    if (!response.ok) return null;

    const data = await response.json();
    return data.totalFeatures || data.numberMatched || (data.features ? data.features.length : null);
  } catch (err) {
    console.error(`Lỗi khi lấy số lượng đối tượng layer ${layerName}:`, err);
    return null;
  }
}

/**
 * Tính tổng chiều dài đường từ WFS (đơn vị km)
 * @returns {Promise<number|null>} Tổng chiều dài km
 */
async function getTotalRoadLength() {
  try {
    const wfsUrl = new URL(WFS_URL);
    wfsUrl.searchParams.set('service',      'WFS');
    wfsUrl.searchParams.set('version',      '1.1.0');
    wfsUrl.searchParams.set('request',      'GetFeature');
    wfsUrl.searchParams.set('typeName',     `${WORKSPACE}:giaothong`);
    wfsUrl.searchParams.set('outputFormat', 'application/json');
    wfsUrl.searchParams.set('srsName',      'EPSG:4326');

    const response = await fetch(wfsUrl.toString());
    if (!response.ok) return null;

    const data = await response.json();
    if (!data.features) return null;

    let totalKm = 0;
    data.features.forEach(function (feature) {
      // Ưu tiên dùng trường chieudai nếu có
      const props = feature.properties || {};
      const cd = props.chieudai || props.CHIEUDAI;
      if (cd && !isNaN(parseFloat(cd))) {
        totalKm += parseFloat(cd);
      } else if (feature.geometry) {
        // Tính từ geometry nếu không có trường chiều dài
        const coords = extractCoordinates(feature.geometry);
        for (let i = 1; i < coords.length; i++) {
          const p1 = ol.proj.fromLonLat(coords[i - 1]);
          const p2 = ol.proj.fromLonLat(coords[i]);
          const dx = p2[0] - p1[0];
          const dy = p2[1] - p1[1];
          totalKm += Math.sqrt(dx * dx + dy * dy) / 1000;
        }
      }
    });

    return Math.round(totalKm);
  } catch (err) {
    console.error('Lỗi khi tính tổng chiều dài đường:', err);
    return null;
  }
}

/** Cập nhật các thẻ thống kê trong sidebar */
async function updateStats() {
  try {
    // Chạy song song để tiết kiệm thời gian
    const [countHuyen, countTruong, countDuong, totalKm] = await Promise.allSettled([
      getFeatureCount('bacgiang'),
      getFeatureCount('truonghoc'),
      getFeatureCount('giaothong'),
      getTotalRoadLength()
    ]);

    const setStatValue = function (id, value, fallback) {
      const el = document.getElementById(id);
      if (el && value !== null && value !== undefined) {
        el.textContent = value;
      } else if (el && fallback !== undefined) {
        el.textContent = fallback;
      }
    };

    setStatValue('statHuyen', countHuyen.status  === 'fulfilled' ? countHuyen.value  : null);
    setStatValue('statTruong', countTruong.status === 'fulfilled' ? countTruong.value : null);
    setStatValue('statDuong',  countDuong.status  === 'fulfilled' ? countDuong.value  : null);
    setStatValue('statKm',     totalKm.status     === 'fulfilled' ? totalKm.value     : null);

  } catch (err) {
    console.error('Lỗi khi cập nhật thống kê:', err);
  }
}

// Cập nhật thống kê sau khi bản đồ tải xong
map.once('rendercomplete', function () {
  // Trì hoãn một chút để không ảnh hưởng đến tải bản đồ
  setTimeout(updateStats, 1500);
});

/* ============================================================
   XỬ LÝ THAY ĐỔI KÍCH THƯỚC CỬA SỔ
   ============================================================ */
window.addEventListener('resize', function () {
  try {
    map.updateSize();
  } catch (err) {
    console.error('Lỗi khi cập nhật kích thước bản đồ:', err);
  }
});

/* ============================================================
   XUẤT HÀM RA PHẠM VI TOÀN CỤC (window)
   Để HTML có thể gọi trực tiếp qua onclick="..."
   ============================================================ */
window.setLayerOpacity    = setLayerOpacity;
window.toggleLayerOpacity = toggleLayerOpacity;
window.zoomToLayer        = zoomToLayer;

/* ============================================================
   KHỞI TẠO HOÀN TẤT
   ============================================================ */
console.log('✅ WebGIS Bắc Giang đã khởi tạo thành công.');
console.log(`   GeoServer: ${GEOSERVER_URL}`);
console.log(`   Workspace: ${WORKSPACE}`);
console.log(`   Trung tâm: ${BAC_GIANG_CENTER}`);
