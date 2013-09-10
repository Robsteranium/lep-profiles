var display_shape_for_lep;

function draw_map(map_data) {
  "use strict";

  var width = 500,
    height = 650;

  var svg = d3.select("#map").append("svg:svg")
    .attr("height", height)
    .attr("width", width);

  var lep_shapes = topojson.feature(map_data, map_data.objects.lep_geo).features;

  var projection = d3.geo.albers()
    .center([2.5, 53])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(6000)
    .translate([width / 2, height / 2]);

  var path = d3.geo.path()
    .projection(projection);

  // Background Shapes
  svg.selectAll(".shape_back")
    .data(lep_shapes)
    .enter().append("path")
      .attr("class", function(d,i) { return "shape_back lep_" + i; })
      .attr("d", path)
      .on("mouseover", function(d) {
/*        d3.select(this)
          .transition()
          .style("fill","#33C")
          .style("opacity", 0.75); */
        display_lep_for_shape(d);
      });
/*      .on("mouseout", function(d) { 
        d3.select(this)
          .transition()
          .style("fill","#66C")
          .style("opacity", 0.5);
      });
*/
  display_shape_for_lep = function(lep_name) {
    //var this_lep_i = lep_shapes.map(function(d) {return(d.properties.name);}).indexOf(lep_name);
    var this_lep_shape = lep_shapes.filter(function(d) {return(d.properties.name === lep_name);});

    var fore_shape = svg.selectAll(".shape_fore")
      .data(this_lep_shape);

    fore_shape.enter().append("path")
      .attr("class", "shape_fore");

    fore_shape
      .attr("d", path)
      .on("mouseover", function(d) {
        display_profile_for_lep(d.properties.name);
        display_hist_for_lep(d.properties.name);
      });

    fore_shape.exit().remove();

  } 
}

var display_lep_for_name = function(name) {
  display_profile_for_lep(name);
  display_hist_for_lep(name);
  display_shape_for_lep(name);
}

var display_lep_for_shape = function(shape) {
  display_lep_for_name(shape.properties.name);
}
