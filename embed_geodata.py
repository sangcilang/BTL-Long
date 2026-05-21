"""
embed_geodata.py
Nhung 3 file GeoJSON thanh 1 file JS (const variables)
Chay duoc ca file:// lan http:// - khong can fetch()
"""
import json, os

files = [
    ('webgis/data/UBNDBG.geojson',  'UBND_DATA'),
    ('webgis/data/hwBG.geojson',    'HIGHWAY_DATA'),
    ('webgis/data/waterBG.geojson', 'WATER_DATA'),
]

lines = []
lines.append('// AUTO-GENERATED — du lieu GeoJSON nhung san vao JS')
lines.append('// Khong can fetch(), chay duoc ca file:// lan http://')
lines.append('')

for path, varname in files:
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    n = len(data['features'])
    size = os.path.getsize(path) / 1024
    lines.append('// ' + path + ' — ' + str(n) + ' features (' + str(round(size,1)) + ' KB)')
    lines.append('const ' + varname + ' = ' + json.dumps(data, ensure_ascii=False, separators=(',',':')) + ';')
    lines.append('')

out = '\n'.join(lines)
with open('webgis/data/geodata.js', 'w', encoding='utf-8') as f:
    f.write(out)

print('OK — webgis/data/geodata.js da tao')
for path, varname in files:
    with open(path, 'r', encoding='utf-8') as f:
        d = json.load(f)
    print('  ' + varname + ': ' + str(len(d['features'])) + ' features')

size_kb = os.path.getsize('webgis/data/geodata.js') / 1024
print('  Tong kich thuoc: ' + str(round(size_kb, 1)) + ' KB')
