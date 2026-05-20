<?xml version="1.0" encoding="UTF-8"?>
<!--
  FILE: line.sld
  MỤC ĐÍCH: Style cho layer đường giao thông (giaothong)
  LAYER: giaothong (geometry LineString)
  MÀU SẮC: Phân loại theo loại đường (loaiduong)
  CHUẨN: OGC SLD 1.0 — tương thích GeoServer
-->
<StyledLayerDescriptor
  version="1.0.0"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.opengis.net/sld
    http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">

  <NamedLayer>
    <Name>giaothong</Name>
    <UserStyle>
      <Title>Giao thông tỉnh Bắc Giang</Title>
      <Abstract>Style phân loại màu theo loại đường giao thông</Abstract>

      <FeatureTypeStyle>

        <!-- ==========================================
             RULE 1: Cao tốc
             Màu đỏ đậm, nét đôi — đường cao tốc
             ========================================== -->
        <Rule>
          <Name>Cao tốc</Name>
          <Title>Đường cao tốc</Title>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>loaiduong</ogc:PropertyName>
              <ogc:Literal>Cao tốc</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <!-- Lớp nền (viền ngoài) — tạo hiệu ứng nét đôi -->
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#8B0000</CssParameter>  <!-- Đỏ đậm -->
              <CssParameter name="stroke-width">7</CssParameter>
              <CssParameter name="stroke-linecap">round</CssParameter>
              <CssParameter name="stroke-linejoin">round</CssParameter>
            </Stroke>
          </LineSymbolizer>
          <!-- Lớp trên (màu chính) -->
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#FF4444</CssParameter>  <!-- Đỏ tươi -->
              <CssParameter name="stroke-width">4</CssParameter>
              <CssParameter name="stroke-linecap">round</CssParameter>
              <CssParameter name="stroke-linejoin">round</CssParameter>
            </Stroke>
          </LineSymbolizer>
          <!-- Label tên đường -->
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>tenduong</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">10</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <!-- Đặt label dọc theo đường -->
              <LinePlacement>
                <PerpendicularOffset>8</PerpendicularOffset>
              </LinePlacement>
            </LabelPlacement>
            <Halo>
              <Radius>2</Radius>
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
                <CssParameter name="fill-opacity">0.9</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#8B0000</CssParameter>
            </Fill>
            <VendorOption name="followLine">true</VendorOption>
            <VendorOption name="maxAngleDelta">45</VendorOption>
            <VendorOption name="maxDisplacement">400</VendorOption>
            <VendorOption name="repeat">300</VendorOption>
          </TextSymbolizer>
        </Rule>

        <!-- ==========================================
             RULE 2: Quốc lộ
             Màu cam đậm, nét đôi — đường quốc lộ
             ========================================== -->
        <Rule>
          <Name>Quốc lộ</Name>
          <Title>Quốc lộ</Title>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>loaiduong</ogc:PropertyName>
              <ogc:Literal>Quốc lộ</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <!-- Viền ngoài -->
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#8B4513</CssParameter>  <!-- Nâu đậm -->
              <CssParameter name="stroke-width">6</CssParameter>
              <CssParameter name="stroke-linecap">round</CssParameter>
              <CssParameter name="stroke-linejoin">round</CssParameter>
            </Stroke>
          </LineSymbolizer>
          <!-- Màu chính -->
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#FF8C00</CssParameter>  <!-- Cam đậm -->
              <CssParameter name="stroke-width">3.5</CssParameter>
              <CssParameter name="stroke-linecap">round</CssParameter>
              <CssParameter name="stroke-linejoin">round</CssParameter>
            </Stroke>
          </LineSymbolizer>
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>tenduong</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">9</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <LinePlacement>
                <PerpendicularOffset>7</PerpendicularOffset>
              </LinePlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1.5</Radius>
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
                <CssParameter name="fill-opacity">0.9</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#8B4513</CssParameter>
            </Fill>
            <VendorOption name="followLine">true</VendorOption>
            <VendorOption name="maxAngleDelta">45</VendorOption>
            <VendorOption name="maxDisplacement">400</VendorOption>
            <VendorOption name="repeat">250</VendorOption>
          </TextSymbolizer>
        </Rule>

        <!-- ==========================================
             RULE 3: Tỉnh lộ
             Màu vàng — đường tỉnh lộ
             ========================================== -->
        <Rule>
          <Name>Tỉnh lộ</Name>
          <Title>Tỉnh lộ</Title>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>loaiduong</ogc:PropertyName>
              <ogc:Literal>Tỉnh lộ</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <!-- Viền ngoài -->
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#B8860B</CssParameter>  <!-- Vàng đậm -->
              <CssParameter name="stroke-width">5</CssParameter>
              <CssParameter name="stroke-linecap">round</CssParameter>
              <CssParameter name="stroke-linejoin">round</CssParameter>
            </Stroke>
          </LineSymbolizer>
          <!-- Màu chính -->
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#FFD700</CssParameter>  <!-- Vàng -->
              <CssParameter name="stroke-width">2.5</CssParameter>
              <CssParameter name="stroke-linecap">round</CssParameter>
              <CssParameter name="stroke-linejoin">round</CssParameter>
            </Stroke>
          </LineSymbolizer>
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>tenduong</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">8</CssParameter>
            </Font>
            <LabelPlacement>
              <LinePlacement>
                <PerpendicularOffset>6</PerpendicularOffset>
              </LinePlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1.5</Radius>
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
                <CssParameter name="fill-opacity">0.85</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#7D6608</CssParameter>
            </Fill>
            <VendorOption name="followLine">true</VendorOption>
            <VendorOption name="maxAngleDelta">45</VendorOption>
            <VendorOption name="maxDisplacement">300</VendorOption>
            <VendorOption name="repeat">200</VendorOption>
          </TextSymbolizer>
        </Rule>

        <!-- ==========================================
             RULE 4: Đường đô thị
             Màu xám nhạt — đường trong thành phố
             ========================================== -->
        <Rule>
          <Name>Đường đô thị</Name>
          <Title>Đường đô thị</Title>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>loaiduong</ogc:PropertyName>
              <ogc:Literal>Đường đô thị</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#555555</CssParameter>
              <CssParameter name="stroke-width">4</CssParameter>
              <CssParameter name="stroke-linecap">round</CssParameter>
            </Stroke>
          </LineSymbolizer>
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#CCCCCC</CssParameter>  <!-- Xám nhạt -->
              <CssParameter name="stroke-width">2.5</CssParameter>
              <CssParameter name="stroke-linecap">round</CssParameter>
            </Stroke>
          </LineSymbolizer>
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>tenduong</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">8</CssParameter>
            </Font>
            <LabelPlacement>
              <LinePlacement>
                <PerpendicularOffset>5</PerpendicularOffset>
              </LinePlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1.5</Radius>
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#333333</CssParameter>
            </Fill>
            <VendorOption name="followLine">true</VendorOption>
            <VendorOption name="maxDisplacement">200</VendorOption>
            <VendorOption name="repeat">150</VendorOption>
          </TextSymbolizer>
        </Rule>

        <!-- ==========================================
             RULE 5: Huyện lộ và mặc định
             Màu xanh lá nhạt — đường huyện
             ========================================== -->
        <Rule>
          <Name>Huyện lộ và khác</Name>
          <Title>Huyện lộ / Đường khác</Title>
          <ElseFilter/>
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#2E7D32</CssParameter>  <!-- Xanh lá đậm -->
              <CssParameter name="stroke-width">3</CssParameter>
              <CssParameter name="stroke-linecap">round</CssParameter>
              <CssParameter name="stroke-linejoin">round</CssParameter>
              <!-- Nét đứt cho đường huyện lộ -->
              <CssParameter name="stroke-dasharray">8 4</CssParameter>
            </Stroke>
          </LineSymbolizer>
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>tenduong</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">7</CssParameter>
              <CssParameter name="font-style">italic</CssParameter>
            </Font>
            <LabelPlacement>
              <LinePlacement>
                <PerpendicularOffset>5</PerpendicularOffset>
              </LinePlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1</Radius>
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#1B5E20</CssParameter>
            </Fill>
            <VendorOption name="followLine">true</VendorOption>
            <VendorOption name="maxDisplacement">200</VendorOption>
            <VendorOption name="repeat">150</VendorOption>
          </TextSymbolizer>
        </Rule>

      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
