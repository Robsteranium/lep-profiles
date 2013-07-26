/*vd3.csv("LEP_profiles.csv", function(data) {*/
  //d3.select("#example")
    //.datum(data)
    //.call(chart);
/*}*/;

//d3.csv("LEP_profiles.csv", draw);

var profile_bar = profile_bar_chart();

d3.csv("LEP_profiles.csv", function(d) {
  return {
    lep: d.LEP,
    profile: Object.keys(d).slice(1,-1).map(function(var_name) { return( { variable: var_name, value: +d[var_name] } )})
  };
}, function(error, rows) {
  profile_bar(rows);
});


d3.json("lep_topo.json", function(error, topo) {
  draw_map(topo);
});

