var display_hist_for_lep;

function totals_histogram(data) {

  "use strict";
  var container_dimensions = {width: 500, height: 250},
      margins = {top: 0, right: 0, bottom: 10, left: 80},
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

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var histogram = d3.select("#histogram")
      .append("svg")
        .attr("width", container_dimensions.width)
        .attr("height", container_dimensions.height)
      .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .attr("id","histogram");

  // Axes
  histogram.append("text")
      .attr("x", chart_dimensions.width - margins.right - 220)
      .attr("y", chart_dimensions.height - margins.bottom - 80)
      .text("LEP areas in productivity order");

  var yAxisG = histogram.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  yAxisG.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margins.left)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Total Local Productivity");

  yAxisG.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margins.left)
      .attr("dy", "2.5em")
      .style("text-anchor", "end")
      .text("Gain/ Loss (£ per hour)");

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
