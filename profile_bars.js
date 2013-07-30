var display_profile_for_lep;

function profile_bar_chart() {

  "use strict";

  var container_dimensions = {width: 700, height: 650},
      margins = {top: 0, right: 20, bottom: 50, left: 170},
      chart_dimensions = {
        width: container_dimensions.width - margins.left - margins.right,
        height: container_dimensions.height - margins.top - margins.bottom
      };

  function profile_bar(data) {

    var profile_variables = data[0].profile.map(function(p) {return p.variable; });

    var y = d3.scale.ordinal()
      .domain(profile_variables)
      .rangeRoundBands([0, chart_dimensions.height],0.2);

    var profile_variable_values = profile_variables.map(function(var_name) {
      return(data.map(function(d){
        return d.profile.filter(function(pro_var){ return pro_var.variable === var_name; })[0].value;
      }));
    });

    var profile_variable_ranges = profile_variable_values.map(function(values) {
      return d3.extent(values);
    });

    var maximum_variable_extent = d3.extent(
      profile_variable_ranges.reduce(function(a,b) { return a.concat(b); })
    );

    var x = d3.scale.linear()
      //.domain([-1,1])
      .domain(maximum_variable_extent)
      .range([0,chart_dimensions.width]);

    //var formatPercent = d3.format(".0%");

    var xAxis = d3.svg.axis()
        .scale(x);
        //.tickFormat(formatPercent);
        //.orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var chart = d3.select("#chart")
      .append("svg")
        .attr("width", container_dimensions.width)
        .attr("height", container_dimensions.height)
      .append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .attr("id","chart");

/*    var key_items = d3.select("#key")
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
*/

    // DRAW AXES
    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + chart_dimensions.height + ")")
        .call(xAxis)
      .append("text")
        .attr("x", chart_dimensions.width - margins.right - 220)
        .attr("dy", "3em")
        .text("Productivity Gain/ Loss (£ per hour)");


    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margins.left)
        .attr("dy", "1em")
        .style("text-anchor", "end")
        .text("Asset Group");

    // DRAW BACKGROUND
    chart.selectAll(".background_bar")
      .data(profile_variable_ranges)
      .enter()
        .append("rect")
        .attr("class", "background_bar")
        .attr("y", function(d,i) { return(y(i)); })
        .attr("height", y.rangeBand())
        .attr("x", function(d) { return(x(d[0])); })
        .attr("width", function(d) { return(x(d[1])-x(d[0])); });

    // DRAW PROFILE BARS
    function display_profile_for_this_lep() {
      var lep_name = d3.select(this).attr("id");
      display_profile_for_lep(lep_name);
    }

    display_profile_for_lep = function(lep_name) {
      var this_lep = data.filter(function(d) {return(d.lep === lep_name)})[0];
      display_lep_name(lep_name);
      display_profile(this_lep.profile);
    }

    function display_profile(profile) {
      var bars = chart.selectAll(".bar")
        .data(profile);

      bars.enter().append("rect")
        .attr("class", "bar")
        .attr("id", function(d) { return d.value});

      bars
        .attr("y", function(d) { return(y(d.variable)); })
        .attr("height", y.rangeBand())
        .attr("x", function(d) { return(x(Math.min(d.value,0))); })
        .attr("width", function(d) { return(x(Math.abs(d.value)) - x(0)); });

      bars.exit().remove();
    }

    function display_lep_name(lep_name) {
      d3.select("#profile_title")
        .datum([lep_name])
        .text(function(d) {return "Performance Analysis for " + d;});
    }
  }

  return profile_bar;
}

