convert_shape_to_geo_json:
	ogr2ogr -f GeoJSON lep_geo.json /home/robin/Code/d3.pion/lep_shapes_simple/lep_shapes.shp
convert_geo_json_to_topo_json:
	topojson --id-property ID -p name=ID -p name -o lep_topo.json lep_geo.json
