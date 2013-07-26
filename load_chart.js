/*vd3.csv("LEP_profiles.csv", function(data) {*/
  //d3.select("#example")
    //.datum(data)
    //.call(chart);
/*}*/;

//d3.csv("LEP_profiles.csv", draw);


d3.csv("LEP_profiles.csv", function(d) {
  return {
    lep: d.LEP,
    profile: Object.keys(d).slice(1,-1).map(function(var_name) { return( { variable: var_name, value: +d[var_name] } )})
  };
}, function(error, rows) {
  draw(rows);
});


d3.json("lep_topo.json", function(error, topo) {
  console.log(topo);
  draw_map(topo);
});

