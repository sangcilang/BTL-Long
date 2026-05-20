<?xml version="1.0" encoding="UTF-8"?>
<!--
  FILE: polygon.sld
  MỤC ĐÍCH: Style cho layer vùng hành chính (bacgiang)
  LAYER: bacgiang (geometry MultiPolygon)
  MÀU SẮC: Phân loại theo loại đơn vị hành chính (type_2)
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
    <Name>bacgiang</Name>
    <UserStyle>
      <Title>Bản đồ hành chính tỉnh Bắc Giang</Title>
      <Abstract>Style phân loại màu theo loại đơn vị hành chính</Abstract>

      <!-- ==========================================
           RULE 1: Thành phố (type_2 = 'Thành phố')
           Màu cam đậm — nổi bật cho đô thị trung tâm
           ========================================== -->
      <FeatureTypeStyle>
        <Rule>
          <Name>Thành phố</Name>
          <Title>Thành phố Bắc Giang</Title>
          <!-- Điều kiện lọc: chỉ áp dụng cho đơn vị loại "Thành phố" -->
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>type_2</ogc:PropertyName>
              <ogc:Literal>Thành phố</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <!-- Màu cam nhạt cho vùng thành phố -->
              <CssParameter name="fill">#FF8C42</CssParameter>
              <CssParameter name="fill-opacity">0.65</CssParameter>
            </Fill>
            <Stroke>
              <!-- Viền đậm màu cam tối -->
              <CssParameter name="stroke">#CC5500</CssParameter>
              <CssParameter name="stroke-width">2.0</CssParameter>
              <CssParameter name="stroke-linejoin">round</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
          <!-- Label tên thành phố -->
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>name_2</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">13</CssParameter>
              <CssParameter name="font-style">normal</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.5</AnchorPointX>
                  <AnchorPointY>0.5</AnchorPointY>
                </AnchorPoint>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <!-- Viền trắng quanh chữ để dễ đọc -->
              <Radius>2</Radius>
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
                <CssParameter name="fill-opacity">0.85</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#7A2800</CssParameter>
            </Fill>
            <VendorOption name="autoWrap">80</VendorOption>
            <VendorOption name="maxDisplacement">50</VendorOption>
          </TextSymbolizer>
        </Rule>

        <!-- ==========================================
             RULE 2: Huyện (type_2 = 'Huyện')
             Màu xanh lá nhạt — màu chuẩn bản đồ hành chính
             ========================================== -->
        <Rule>
          <Name>Huyện</Name>
          <Title>Huyện</Title>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>type_2</ogc:PropertyName>
              <ogc:Literal>Huyện</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <!-- Màu xanh lá nhạt cho huyện -->
              <CssParameter name="fill">#A8D5A2</CssParameter>
              <CssParameter name="fill-opacity">0.60</CssParameter>
            </Fill>
            <Stroke>
              <!-- Viền xanh đậm -->
              <CssParameter name="stroke">#2D6A4F</CssParameter>
              <CssParameter name="stroke-width">1.5</CssParameter>
              <CssParameter name="stroke-linejoin">round</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
          <!-- Label tên huyện -->
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>name_2</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">11</CssParameter>
              <CssParameter name="font-style">normal</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.5</AnchorPointX>
                  <AnchorPointY>0.5</AnchorPointY>
                </AnchorPoint>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>2</Radius>
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
                <CssParameter name="fill-opacity">0.85</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#1B4332</CssParameter>
            </Fill>
            <VendorOption name="autoWrap">70</VendorOption>
            <VendorOption name="maxDisplacement">50</VendorOption>
          </TextSymbolizer>
        </Rule>

        <!-- ==========================================
             RULE 3: Mặc định (các loại khác)
             Màu xám nhạt
             ========================================== -->
        <Rule>
          <Name>Khác</Name>
          <Title>Đơn vị hành chính khác</Title>
          <!-- ElseFilter: áp dụng cho tất cả trường hợp không khớp rule trên -->
          <ElseFilter/>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#D4E6F1</CssParameter>
              <CssParameter name="fill-opacity">0.55</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#5D6D7E</CssParameter>
              <CssParameter name="stroke-width">1.2</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>name_2</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">10</CssParameter>
              <CssParameter name="font-style">italic</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.5</AnchorPointX>
                  <AnchorPointY>0.5</AnchorPointY>
                </AnchorPoint>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1.5</Radius>
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#2C3E50</CssParameter>
            </Fill>
            <VendorOption name="autoWrap">60</VendorOption>
            <VendorOption name="maxDisplacement">40</VendorOption>
          </TextSymbolizer>
        </Rule>

      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
