var display_profile_for_lep;

function profile_bar_chart() {

  "use strict";

  var container_dimensions = {width: 700, height: 650},
      margins = {top: 60, right: 0, bottom: 60, left: 60},
      chart_dimensions = {
        width: container_dimensions.width - margins.left - margins.right,
        height: container_dimensions.height - margins.top - margins.bottom
      };

  function profile_bar(data) {

    var x = d3.scale.ordinal()
      .domain(data[0].profile.map(function(p) {return p.variable; }))
      .rangeRoundBands([0, chart_dimensions.width],0.2);

    var y = d3.scale.linear()
      .domain([-1,1])
      .range([chart_dimensions.height,0]);

    var formatPercent = d3.format(".0%");

    var xAxis = d3.svg.axis()
        .scale(x);
        //.orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatPercent);

    var chart = d3.select("#chart")
      .append("svg")
        .attr("width", container_dimensions.width)
        .attr("height", container_dimensions.height)
      .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .attr("id","chart");

    var key_items = d3.select("#key")
      .selectAll("div")
      .data(data)
      .enter()
      .append("div")
        .attr("class", "key_line")
        .attr("id", function(d) {
          return(d.lep)
        });

    key_items.append("div")
      .text(function(d) {
        return(d.lep)
      });

    d3.selectAll(".key_line")
      .on("click", display_profile_for_this_lep);

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chart_dimensions.height + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Contribution to Productivity");
    function display_profile_for_this_lep() {
      var lep_name = d3.select(this).attr("id");
      display_profile_for_lep(lep_name);
    }

    display_profile_for_lep = function(lep_name) {
      var this_lep = data.filter(function(d) {return(d.lep === lep_name)})[0];
      display_profile(this_lep.profile);
    }

    function display_profile(profile) {
      var bars = chart.selectAll(".bar")
        .data(profile);

      bars.enter().append("rect")
        .attr("class", "bar")
        .attr("id", function(d) { return d.value});

      bars
        .attr("x", function(d) { return(x(d.variable)); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return(y(Math.max(d.value,0))); })
        .attr("height", function(d) { return(y(0)-y(Math.abs(d.value))); });

      bars.exit().remove();
    }
  }

  profile_bar.prototype.update_for_lep = function(lep_name) {
    console.log(lep_name);
  }

  return profile_bar;
}

