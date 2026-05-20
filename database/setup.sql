-- ============================================================
-- FILE: setup.sql
-- MỤC ĐÍCH: Thiết lập toàn bộ cơ sở dữ liệu cho hệ thống
--           WebGIS quản lý hành chính và giao thông tỉnh Bắc Giang
-- TÁC GIẢ: WebGIS Bắc Giang Project
-- NGÀY: 2025
-- ============================================================

-- Bước 1: Bật extension PostGIS (nếu chưa có)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- ============================================================
-- BẢNG bacgiang đã có sẵn từ file "Bt giua ky.sql"
-- Cấu trúc: gid, id_0, iso, name_0, id_1, name_1,
--           id_2, name_2, hasc_2, ccn_2, cca_2,
--           type_2, engtype_2, nl_name_2, varname_2,
--           geom geometry(MultiPolygon,4326), population
-- Spatial index GIST đã được tạo: bacgiang_geom_idx
-- ============================================================

-- ============================================================
-- PHẦN 2A: BẢNG TRƯỜNG HỌC (truonghoc)
-- Lưu trữ vị trí và thông tin các trường học tỉnh Bắc Giang
-- ============================================================

-- Xóa bảng nếu đã tồn tại (để chạy lại script)
DROP TABLE IF EXISTS public.truonghoc;

CREATE TABLE IF NOT EXISTS public.truonghoc (
    id        SERIAL PRIMARY KEY,                    -- Khóa chính tự tăng
    ten       VARCHAR(200) NOT NULL,                 -- Tên trường học
    loai      VARCHAR(50),                           -- Loại: Tiểu học, THCS, THPT, Đại học
    diachi    VARCHAR(300),                          -- Địa chỉ đầy đủ
    huyen     VARCHAR(100),                          -- Tên huyện/thành phố
    sdt       VARCHAR(20),                           -- Số điện thoại liên hệ
    email     VARCHAR(100),                          -- Email liên hệ
    nam_thanh_lap INTEGER,                           -- Năm thành lập
    so_hoc_sinh  INTEGER,                            -- Số học sinh hiện tại
    geom      geometry(Point, 4326)                  -- Tọa độ điểm (kinh độ, vĩ độ)
);

-- Tạo spatial index GIST cho bảng truonghoc
CREATE INDEX IF NOT EXISTS truonghoc_geom_idx
    ON public.truonghoc USING GIST (geom);

-- Tạo index thường cho tìm kiếm theo tên và loại
CREATE INDEX IF NOT EXISTS truonghoc_ten_idx
    ON public.truonghoc (ten);
CREATE INDEX IF NOT EXISTS truonghoc_loai_idx
    ON public.truonghoc (loai);
CREATE INDEX IF NOT EXISTS truonghoc_huyen_idx
    ON public.truonghoc (huyen);

-- Phân quyền
ALTER TABLE IF EXISTS public.truonghoc OWNER TO postgres;

-- ============================================================
-- INSERT DỮ LIỆU MẪU: TRƯỜNG HỌC TỈNH BẮC GIANG
-- Tọa độ thực tế (WGS84) của các trường tại Bắc Giang
-- ============================================================

INSERT INTO public.truonghoc (ten, loai, diachi, huyen, sdt, email, nam_thanh_lap, so_hoc_sinh, geom)
VALUES

-- TP. Bắc Giang
('Trường THPT Ngô Sĩ Liên',
 'THPT',
 'Số 2 Nguyễn Thị Minh Khai, TP. Bắc Giang',
 'TP. Bắc Giang',
 '0204.3854.123',
 'thptngosilienBG@edu.vn',
 1956, 1850,
 ST_SetSRID(ST_MakePoint(106.1943, 21.2731), 4326)),

('Trường THPT Bắc Giang',
 'THPT',
 'Đường Hoàng Văn Thụ, TP. Bắc Giang',
 'TP. Bắc Giang',
 '0204.3854.456',
 'thptbacgiang@edu.vn',
 1962, 1650,
 ST_SetSRID(ST_MakePoint(106.1978, 21.2698), 4326)),

('Trường THCS Lê Quý Đôn',
 'THCS',
 'Phường Trần Phú, TP. Bắc Giang',
 'TP. Bắc Giang',
 '0204.3854.789',
 'thcslequydon@edu.vn',
 1975, 980,
 ST_SetSRID(ST_MakePoint(106.1921, 21.2756), 4326)),

('Trường Tiểu học Hoàng Văn Thụ',
 'Tiểu học',
 'Phường Hoàng Văn Thụ, TP. Bắc Giang',
 'TP. Bắc Giang',
 '0204.3854.321',
 'thhoanvanthu@edu.vn',
 1980, 750,
 ST_SetSRID(ST_MakePoint(106.1965, 21.2712), 4326)),

('Trường Đại học Bắc Giang',
 'Đại học',
 'Số 4 Lê Lợi, TP. Bắc Giang',
 'TP. Bắc Giang',
 '0204.3854.000',
 'dhbacgiang@edu.vn',
 2006, 5200,
 ST_SetSRID(ST_MakePoint(106.2012, 21.2680), 4326)),

-- Huyện Lạng Giang
('Trường THPT Lạng Giang số 1',
 'THPT',
 'TT. Vôi, Huyện Lạng Giang',
 'Lạng Giang',
 '0204.3861.100',
 'thptlg1@edu.vn',
 1968, 1200,
 ST_SetSRID(ST_MakePoint(106.2534, 21.3012), 4326)),

('Trường THCS Lạng Giang',
 'THCS',
 'TT. Vôi, Huyện Lạng Giang',
 'Lạng Giang',
 '0204.3861.200',
 'thcslg@edu.vn',
 1972, 820,
 ST_SetSRID(ST_MakePoint(106.2498, 21.2989), 4326)),

('Trường Tiểu học Thị trấn Vôi',
 'Tiểu học',
 'TT. Vôi, Huyện Lạng Giang',
 'Lạng Giang',
 '0204.3861.300',
 'thttvoi@edu.vn',
 1965, 560,
 ST_SetSRID(ST_MakePoint(106.2512, 21.3034), 4326)),

-- Huyện Lục Nam
('Trường THPT Lục Nam',
 'THPT',
 'TT. Đồi Ngô, Huyện Lục Nam',
 'Lục Nam',
 '0204.3862.100',
 'thptlucnam@edu.vn',
 1970, 1100,
 ST_SetSRID(ST_MakePoint(106.3421, 21.3156), 4326)),

('Trường THCS Đồi Ngô',
 'THCS',
 'TT. Đồi Ngô, Huyện Lục Nam',
 'Lục Nam',
 '0204.3862.200',
 'thcsdoingo@edu.vn',
 1978, 740,
 ST_SetSRID(ST_MakePoint(106.3398, 21.3178), 4326)),

-- Huyện Yên Thế
('Trường THPT Yên Thế',
 'THPT',
 'TT. Cầu Gồ, Huyện Yên Thế',
 'Yên Thế',
 '0204.3863.100',
 'thptyenthe@edu.vn',
 1966, 950,
 ST_SetSRID(ST_MakePoint(106.0823, 21.4234), 4326)),

('Trường THCS Cầu Gồ',
 'THCS',
 'TT. Cầu Gồ, Huyện Yên Thế',
 'Yên Thế',
 '0204.3863.200',
 'thcscaugo@edu.vn',
 1974, 680,
 ST_SetSRID(ST_MakePoint(106.0801, 21.4256), 4326)),

-- Huyện Hiệp Hòa
('Trường THPT Hiệp Hòa số 1',
 'THPT',
 'TT. Thắng, Huyện Hiệp Hòa',
 'Hiệp Hòa',
 '0204.3864.100',
 'thpthh1@edu.vn',
 1963, 1300,
 ST_SetSRID(ST_MakePoint(105.9234, 21.3567), 4326)),

('Trường Tiểu học Thắng',
 'Tiểu học',
 'TT. Thắng, Huyện Hiệp Hòa',
 'Hiệp Hòa',
 '0204.3864.200',
 'thththang@edu.vn',
 1960, 620,
 ST_SetSRID(ST_MakePoint(105.9256, 21.3589), 4326)),

-- Huyện Việt Yên
('Trường THPT Việt Yên số 1',
 'THPT',
 'TT. Bích Động, Huyện Việt Yên',
 'Việt Yên',
 '0204.3865.100',
 'thptvy1@edu.vn',
 1967, 1400,
 ST_SetSRID(ST_MakePoint(106.0512, 21.2934), 4326)),

('Trường THCS Bích Động',
 'THCS',
 'TT. Bích Động, Huyện Việt Yên',
 'Việt Yên',
 '0204.3865.200',
 'thcsbichdong@edu.vn',
 1976, 890,
 ST_SetSRID(ST_MakePoint(106.0489, 21.2956), 4326)),

-- Huyện Tân Yên
('Trường THPT Tân Yên số 1',
 'THPT',
 'TT. Cao Thượng, Huyện Tân Yên',
 'Tân Yên',
 '0204.3866.100',
 'thptty1@edu.vn',
 1969, 1050,
 ST_SetSRID(ST_MakePoint(106.0934, 21.3789), 4326)),

-- Huyện Sơn Động
('Trường THPT Sơn Động số 1',
 'THPT',
 'TT. An Châu, Huyện Sơn Động',
 'Sơn Động',
 '0204.3867.100',
 'thptsd1@edu.vn',
 1971, 780,
 ST_SetSRID(ST_MakePoint(106.8234, 21.3456), 4326)),

-- Huyện Lục Ngạn
('Trường THPT Lục Ngạn số 1',
 'THPT',
 'TT. Chũ, Huyện Lục Ngạn',
 'Lục Ngạn',
 '0204.3868.100',
 'thptln1@edu.vn',
 1965, 1150,
 ST_SetSRID(ST_MakePoint(106.5123, 21.3678), 4326)),

('Trường THCS Chũ',
 'THCS',
 'TT. Chũ, Huyện Lục Ngạn',
 'Lục Ngạn',
 '0204.3868.200',
 'thcschu@edu.vn',
 1973, 760,
 ST_SetSRID(ST_MakePoint(106.5098, 21.3701), 4326));

-- ============================================================
-- PHẦN 2B: BẢNG GIAO THÔNG (giaothong)
-- Lưu trữ thông tin các tuyến đường giao thông tỉnh Bắc Giang
-- ============================================================

-- Xóa bảng nếu đã tồn tại
DROP TABLE IF EXISTS public.giaothong;

CREATE TABLE IF NOT EXISTS public.giaothong (
    id          SERIAL PRIMARY KEY,                  -- Khóa chính tự tăng
    tenduong    VARCHAR(200) NOT NULL,               -- Tên đường/tuyến
    loaiduong   VARCHAR(50),                         -- Loại: Quốc lộ, Tỉnh lộ, Huyện lộ, Đường đô thị
    chieudai    NUMERIC(10, 2),                      -- Chiều dài (km)
    chatluong   VARCHAR(50),                         -- Chất lượng: Tốt, Trung bình, Kém
    so_lane     INTEGER,                             -- Số làn đường
    nam_xay     INTEGER,                             -- Năm xây dựng/nâng cấp
    don_vi_ql   VARCHAR(200),                        -- Đơn vị quản lý
    geom        geometry(LineString, 4326)           -- Đường tuyến (LineString)
);

-- Tạo spatial index GIST cho bảng giaothong
CREATE INDEX IF NOT EXISTS giaothong_geom_idx
    ON public.giaothong USING GIST (geom);

-- Tạo index thường cho tìm kiếm
CREATE INDEX IF NOT EXISTS giaothong_loai_idx
    ON public.giaothong (loaiduong);
CREATE INDEX IF NOT EXISTS giaothong_ten_idx
    ON public.giaothong (tenduong);

-- Phân quyền
ALTER TABLE IF EXISTS public.giaothong OWNER TO postgres;

-- ============================================================
-- INSERT DỮ LIỆU MẪU: GIAO THÔNG TỈNH BẮC GIANG
-- Các tuyến đường chính thực tế tại Bắc Giang
-- ============================================================

INSERT INTO public.giaothong (tenduong, loaiduong, chieudai, chatluong, so_lane, nam_xay, don_vi_ql, geom)
VALUES

-- Quốc lộ 1A đoạn qua Bắc Giang (Bắc - Nam)
('Quốc lộ 1A đoạn Bắc Giang',
 'Quốc lộ',
 45.30,
 'Tốt',
 4,
 2010,
 'Cục Đường bộ Việt Nam',
 ST_SetSRID(
   ST_MakeLine(
     ARRAY[
       ST_MakePoint(106.1234, 21.1890),
       ST_MakePoint(106.1456, 21.2234),
       ST_MakePoint(106.1678, 21.2567),
       ST_MakePoint(106.1890, 21.2890),
       ST_MakePoint(106.2012, 21.3234),
       ST_MakePoint(106.2234, 21.3567),
       ST_MakePoint(106.2456, 21.3890)
     ]
   ), 4326
 )),

-- Quốc lộ 31 (Bắc Giang - Lạng Sơn)
('Quốc lộ 31',
 'Quốc lộ',
 62.50,
 'Tốt',
 2,
 2015,
 'Cục Đường bộ Việt Nam',
 ST_SetSRID(
   ST_MakeLine(
     ARRAY[
       ST_MakePoint(106.1943, 21.2731),
       ST_MakePoint(106.2567, 21.3012),
       ST_MakePoint(106.3234, 21.3345),
       ST_MakePoint(106.4012, 21.3567),
       ST_MakePoint(106.5123, 21.3678),
       ST_MakePoint(106.6234, 21.3890),
       ST_MakePoint(106.7345, 21.4012),
       ST_MakePoint(106.8234, 21.3456)
     ]
   ), 4326
 )),

-- Quốc lộ 37 (Bắc Giang - Thái Nguyên)
('Quốc lộ 37',
 'Quốc lộ',
 38.70,
 'Trung bình',
 2,
 2005,
 'Cục Đường bộ Việt Nam',
 ST_SetSRID(
   ST_MakeLine(
     ARRAY[
       ST_MakePoint(106.1943, 21.2731),
       ST_MakePoint(106.1234, 21.3234),
       ST_MakePoint(106.0567, 21.3789),
       ST_MakePoint(105.9890, 21.4234),
       ST_MakePoint(105.9234, 21.4678)
     ]
   ), 4326
 )),

-- Tỉnh lộ 295 (TP. Bắc Giang - Việt Yên)
('Tỉnh lộ 295',
 'Tỉnh lộ',
 18.40,
 'Tốt',
 2,
 2018,
 'Sở GTVT Bắc Giang',
 ST_SetSRID(
   ST_MakeLine(
     ARRAY[
       ST_MakePoint(106.1943, 21.2731),
       ST_MakePoint(106.1234, 21.2890),
       ST_MakePoint(106.0567, 21.2956),
       ST_MakePoint(105.9890, 21.2934)
     ]
   ), 4326
 )),

-- Tỉnh lộ 293 (TP. Bắc Giang - Hiệp Hòa)
('Tỉnh lộ 293',
 'Tỉnh lộ',
 22.60,
 'Tốt',
 2,
 2016,
 'Sở GTVT Bắc Giang',
 ST_SetSRID(
   ST_MakeLine(
     ARRAY[
       ST_MakePoint(106.1943, 21.2731),
       ST_MakePoint(106.1012, 21.3012),
       ST_MakePoint(106.0234, 21.3234),
       ST_MakePoint(105.9567, 21.3456),
       ST_MakePoint(105.9234, 21.3567)
     ]
   ), 4326
 )),

-- Tỉnh lộ 398 (Lạng Giang - Lục Nam)
('Tỉnh lộ 398',
 'Tỉnh lộ',
 28.90,
 'Trung bình',
 2,
 2008,
 'Sở GTVT Bắc Giang',
 ST_SetSRID(
   ST_MakeLine(
     ARRAY[
       ST_MakePoint(106.2534, 21.3012),
       ST_MakePoint(106.2890, 21.3123),
       ST_MakePoint(106.3234, 21.3156),
       ST_MakePoint(106.3421, 21.3156)
     ]
   ), 4326
 )),

-- Đường đô thị: Đường Lê Lợi (TP. Bắc Giang)
('Đường Lê Lợi',
 'Đường đô thị',
 3.20,
 'Tốt',
 4,
 2012,
 'UBND TP. Bắc Giang',
 ST_SetSRID(
   ST_MakeLine(
     ARRAY[
       ST_MakePoint(106.1834, 21.2698),
       ST_MakePoint(106.1890, 21.2712),
       ST_MakePoint(106.1943, 21.2731),
       ST_MakePoint(106.2012, 21.2756),
       ST_MakePoint(106.2067, 21.2780)
     ]
   ), 4326
 )),

-- Đường đô thị: Đường Hoàng Văn Thụ (TP. Bắc Giang)
('Đường Hoàng Văn Thụ',
 'Đường đô thị',
 2.80,
 'Tốt',
 4,
 2014,
 'UBND TP. Bắc Giang',
 ST_SetSRID(
   ST_MakeLine(
     ARRAY[
       ST_MakePoint(106.1890, 21.2645),
       ST_MakePoint(106.1921, 21.2678),
       ST_MakePoint(106.1965, 21.2712),
       ST_MakePoint(106.2012, 21.2745)
     ]
   ), 4326
 )),

-- Huyện lộ: Đường Yên Thế - Tân Yên
('Đường Yên Thế - Tân Yên',
 'Huyện lộ',
 15.60,
 'Trung bình',
 2,
 2003,
 'UBND Huyện Yên Thế',
 ST_SetSRID(
   ST_MakeLine(
     ARRAY[
       ST_MakePoint(106.0823, 21.4234),
       ST_MakePoint(106.0934, 21.4012),
       ST_MakePoint(106.0934, 21.3789)
     ]
   ), 4326
 )),

-- Huyện lộ: Đường Lục Ngạn - Sơn Động
('Đường Lục Ngạn - Sơn Động',
 'Huyện lộ',
 42.30,
 'Kém',
 2,
 1998,
 'UBND Huyện Lục Ngạn',
 ST_SetSRID(
   ST_MakeLine(
     ARRAY[
       ST_MakePoint(106.5123, 21.3678),
       ST_MakePoint(106.6012, 21.3567),
       ST_MakePoint(106.7012, 21.3456),
       ST_MakePoint(106.8234, 21.3456)
     ]
   ), 4326
 )),

-- Đường cao tốc Hà Nội - Bắc Giang (đoạn qua tỉnh)
('Cao tốc Hà Nội - Bắc Giang',
 'Cao tốc',
 46.00,
 'Tốt',
 6,
 2020,
 'VEC - Tổng Công ty Đầu tư Phát triển Đường cao tốc',
 ST_SetSRID(
   ST_MakeLine(
     ARRAY[
       ST_MakePoint(105.8234, 21.1890),
       ST_MakePoint(105.9012, 21.2123),
       ST_MakePoint(105.9890, 21.2456),
       ST_MakePoint(106.0567, 21.2678),
       ST_MakePoint(106.1234, 21.2756),
       ST_MakePoint(106.1943, 21.2731)
     ]
   ), 4326
 )),

-- Tỉnh lộ 292 (Bắc Giang - Lạng Giang)
('Tỉnh lộ 292',
 'Tỉnh lộ',
 16.80,
 'Tốt',
 2,
 2019,
 'Sở GTVT Bắc Giang',
 ST_SetSRID(
   ST_MakeLine(
     ARRAY[
       ST_MakePoint(106.1943, 21.2731),
       ST_MakePoint(106.2123, 21.2890),
       ST_MakePoint(106.2345, 21.3012),
       ST_MakePoint(106.2534, 21.3012)
     ]
   ), 4326
 ));

-- ============================================================
-- KIỂM TRA DỮ LIỆU SAU KHI INSERT
-- ============================================================

-- Kiểm tra số lượng bản ghi
SELECT 'bacgiang' AS bang, COUNT(*) AS so_ban_ghi FROM public.bacgiang
UNION ALL
SELECT 'truonghoc', COUNT(*) FROM public.truonghoc
UNION ALL
SELECT 'giaothong', COUNT(*) FROM public.giaothong;

-- Kiểm tra spatial reference
SELECT 'bacgiang' AS bang, ST_SRID(geom) AS srid FROM public.bacgiang LIMIT 1
UNION ALL
SELECT 'truonghoc', ST_SRID(geom) FROM public.truonghoc LIMIT 1
UNION ALL
SELECT 'giaothong', ST_SRID(geom) FROM public.giaothong LIMIT 1;

-- Kiểm tra extent (phạm vi) của từng bảng
SELECT 'bacgiang' AS bang, ST_AsText(ST_Extent(geom)) AS extent FROM public.bacgiang
UNION ALL
SELECT 'truonghoc', ST_AsText(ST_Extent(geom)) FROM public.truonghoc
UNION ALL
SELECT 'giaothong', ST_AsText(ST_Extent(geom)) FROM public.giaothong;

-- ============================================================
-- KẾT THÚC FILE setup.sql
-- ============================================================
