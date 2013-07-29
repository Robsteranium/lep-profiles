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

  svg.selectAll(".lep_shape")
    .data(lep_shapes)
    .enter().append("path")
      //.attr("class", function(d) { return "lep_shape " + d.id; })
      .attr("class","lep_shape")
      .attr("d", path)
      .on("mouseover", function(d) {
        d3.select(this)
          .transition()
          .style("fill","#33C");
        display_lep(d)
      })
      .on("mouseout", function(d) { 
        d3.select(this)
          .transition()
          .style("fill","#AAF");
      });

  function display_lep(shape) {
    display_profile_for_lep(shape.properties.name);
  }
}
