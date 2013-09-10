var display_hist_for_lep;

function totals_histogram(data) {

  "use strict";
  var container_dimensions = {width: 500, height: 250},
      margins = {top: 20, right: 20, bottom: 20, left: 20},
      chart_dimensions = {
        width: container_dimensions.width - margins.left - margins.right,
        height: container_dimensions.height - margins.top - margins.bottom
      };

  var x= d3.scale.ordinal()
    .domain(data.map( function(d) {return d.lep;} ))
    .rangeRoundBands([0,chart_dimensions.width],0.5);

  var y = d3.scale.linear()
    .domain(d3.extent(data.map( function(d) {return d.total;} )))
    .range([chart_dimensions.height,0]);

  var histogram = d3.select("#histogram")
      .append("svg")
        .attr("width", container_dimensions.width)
        .attr("height", container_dimensions.height)
      .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .attr("id","histogram");

  // Background Bars
  var back_bars = histogram.selectAll(".hist_back")
    .data(data);

  back_bars.enter().append("rect")
    .attr("class", "hist_back")

  back_bars
    .attr("y", function(d) { return(y(Math.max(d.total,0))); })
    .attr("height", function(d) { return(y(0)-y(Math.abs(d.total))); })
    .attr("x", function(d) { return x(d.lep); })
    .attr("width", function(d) { return x.rangeBand(); })
    .attr("id-value", function(d) { return d.total; })
    .on("mouseover", function(d) {
      display_lep_for_name(d.lep);
    });



  //hist_bars.exit().remove();

  display_hist_for_lep = function(lep_name) {
    var this_lep = data.filter(function(d) {return(d.lep === lep_name)})[0];
    var less_productive_leps = data.filter(function(d) {return(d.total <= this_lep.total)});
    
    var fore_bars = histogram.selectAll(".hist_fore")
      .data(less_productive_leps);

    fore_bars.enter().append("rect")
      .attr("class", "hist_fore");

    fore_bars
      .attr("y", function(d) { return(y(Math.max(d.total,0))); })
      .attr("height", function(d) { return(y(0)-y(Math.abs(d.total))); })
      .attr("x", function(d) { return x(d.lep); })
      .attr("width", function(d) { return x.rangeBand(); })
      .on("mouseover", function(d) {
        display_lep_for_name(d.lep);
      });

    fore_bars.exit().remove();
  }

}
