<?xml version="1.0" encoding="UTF-8"?>
<!--
  FILE: point.sld
  MỤC ĐÍCH: Style cho layer điểm trường học (truonghoc)
  LAYER: truonghoc (geometry Point)
  MÀU SẮC: Phân loại theo loại trường (loai)
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
    <Name>truonghoc</Name>
    <UserStyle>
      <Title>Trường học tỉnh Bắc Giang</Title>
      <Abstract>Style phân loại màu theo cấp học</Abstract>

      <FeatureTypeStyle>

        <!-- ==========================================
             RULE 1: Đại học / Cao đẳng
             Biểu tượng ngôi sao màu tím — cấp cao nhất
             ========================================== -->
        <Rule>
          <Name>Đại học</Name>
          <Title>Đại học / Cao đẳng</Title>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>loai</ogc:PropertyName>
              <ogc:Literal>Đại học</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <!-- Hình ngôi sao cho đại học -->
                <WellKnownName>star</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#8E44AD</CssParameter>  <!-- Tím -->
                  <CssParameter name="fill-opacity">0.9</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#5B2C6F</CssParameter>
                  <CssParameter name="stroke-width">1.5</CssParameter>
                </Stroke>
              </Mark>
              <Size>18</Size>
            </Graphic>
          </PointSymbolizer>
          <!-- Label tên trường -->
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>ten</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">10</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.0</AnchorPointX>
                  <AnchorPointY>0.5</AnchorPointY>
                </AnchorPoint>
                <Displacement>
                  <DisplacementX>12</DisplacementX>
                  <DisplacementY>0</DisplacementY>
                </Displacement>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>2</Radius>
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
                <CssParameter name="fill-opacity">0.9</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#5B2C6F</CssParameter>
            </Fill>
            <VendorOption name="autoWrap">100</VendorOption>
            <VendorOption name="maxDisplacement">80</VendorOption>
            <VendorOption name="conflictResolution">true</VendorOption>
          </TextSymbolizer>
        </Rule>

        <!-- ==========================================
             RULE 2: THPT (Trung học phổ thông)
             Hình tròn màu đỏ — cấp 3
             ========================================== -->
        <Rule>
          <Name>THPT</Name>
          <Title>Trung học phổ thông</Title>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>loai</ogc:PropertyName>
              <ogc:Literal>THPT</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#E74C3C</CssParameter>  <!-- Đỏ -->
                  <CssParameter name="fill-opacity">0.9</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#922B21</CssParameter>
                  <CssParameter name="stroke-width">1.5</CssParameter>
                </Stroke>
              </Mark>
              <Size>14</Size>
            </Graphic>
          </PointSymbolizer>
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>ten</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">9</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.0</AnchorPointX>
                  <AnchorPointY>0.5</AnchorPointY>
                </AnchorPoint>
                <Displacement>
                  <DisplacementX>10</DisplacementX>
                  <DisplacementY>0</DisplacementY>
                </Displacement>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1.5</Radius>
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
                <CssParameter name="fill-opacity">0.85</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#7B241C</CssParameter>
            </Fill>
            <VendorOption name="autoWrap">90</VendorOption>
            <VendorOption name="maxDisplacement">60</VendorOption>
            <VendorOption name="conflictResolution">true</VendorOption>
          </TextSymbolizer>
        </Rule>

        <!-- ==========================================
             RULE 3: THCS (Trung học cơ sở)
             Hình vuông màu xanh dương — cấp 2
             ========================================== -->
        <Rule>
          <Name>THCS</Name>
          <Title>Trung học cơ sở</Title>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>loai</ogc:PropertyName>
              <ogc:Literal>THCS</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>square</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#2980B9</CssParameter>  <!-- Xanh dương -->
                  <CssParameter name="fill-opacity">0.9</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#1A5276</CssParameter>
                  <CssParameter name="stroke-width">1.5</CssParameter>
                </Stroke>
              </Mark>
              <Size>12</Size>
            </Graphic>
          </PointSymbolizer>
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>ten</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">9</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.0</AnchorPointX>
                  <AnchorPointY>0.5</AnchorPointY>
                </AnchorPoint>
                <Displacement>
                  <DisplacementX>9</DisplacementX>
                  <DisplacementY>0</DisplacementY>
                </Displacement>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1.5</Radius>
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
                <CssParameter name="fill-opacity">0.85</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#1A5276</CssParameter>
            </Fill>
            <VendorOption name="autoWrap">80</VendorOption>
            <VendorOption name="maxDisplacement">50</VendorOption>
            <VendorOption name="conflictResolution">true</VendorOption>
          </TextSymbolizer>
        </Rule>

        <!-- ==========================================
             RULE 4: Tiểu học
             Hình tam giác màu xanh lá — cấp 1
             ========================================== -->
        <Rule>
          <Name>Tiểu học</Name>
          <Title>Tiểu học</Title>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>loai</ogc:PropertyName>
              <ogc:Literal>Tiểu học</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>triangle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#27AE60</CssParameter>  <!-- Xanh lá -->
                  <CssParameter name="fill-opacity">0.9</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#1E8449</CssParameter>
                  <CssParameter name="stroke-width">1.5</CssParameter>
                </Stroke>
              </Mark>
              <Size>12</Size>
            </Graphic>
          </PointSymbolizer>
          <TextSymbolizer>
            <Label>
              <ogc:PropertyName>ten</ogc:PropertyName>
            </Label>
            <Font>
              <CssParameter name="font-family">Arial</CssParameter>
              <CssParameter name="font-size">8</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.0</AnchorPointX>
                  <AnchorPointY>0.5</AnchorPointY>
                </AnchorPoint>
                <Displacement>
                  <DisplacementX>9</DisplacementX>
                  <DisplacementY>0</DisplacementY>
                </Displacement>
              </PointPlacement>
            </LabelPlacement>
            <Halo>
              <Radius>1.5</Radius>
              <Fill>
                <CssParameter name="fill">#FFFFFF</CssParameter>
                <CssParameter name="fill-opacity">0.85</CssParameter>
              </Fill>
            </Halo>
            <Fill>
              <CssParameter name="fill">#1E8449</CssParameter>
            </Fill>
            <VendorOption name="autoWrap">80</VendorOption>
            <VendorOption name="maxDisplacement">50</VendorOption>
            <VendorOption name="conflictResolution">true</VendorOption>
          </TextSymbolizer>
        </Rule>

        <!-- ==========================================
             RULE 5: Mặc định (loại khác)
             Hình tròn màu xám
             ========================================== -->
        <Rule>
          <Name>Khác</Name>
          <Title>Loại khác</Title>
          <ElseFilter/>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#95A5A6</CssParameter>
                  <CssParameter name="fill-opacity">0.8</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#717D7E</CssParameter>
                  <CssParameter name="stroke-width">1.0</CssParameter>
                </Stroke>
              </Mark>
              <Size>10</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>

      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
