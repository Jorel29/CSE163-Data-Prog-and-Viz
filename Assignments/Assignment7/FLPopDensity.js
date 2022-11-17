//Define Margin
var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
width = 960 - margin.left -margin.right,
height = 660 - margin.top - margin.bottom;

//Define Color
var color = d3.scaleOrdinal(d3.schemeCategory10);

//Define SVG
var svg = d3.select("body")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)

var path = d3.geoPath();

var color = d3.scaleThreshold()
    .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
    .range(d3.schemeOrRd[9]);

var x = d3.scaleSqrt()
    .domain([0, 4500])
    .rangeRound([440, 950]);

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

g.selectAll("rect")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });

g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Population per square mile");

g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickValues(color.domain()))
  .select(".domain")
    .remove();

d3.json("ca-topo.json").then(function(error, topology) {
  

  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(topology, topology.objects.tracts).features)
    .enter().append("path")
      .attr("fill", function(d) { return color(d.properties.density); })
      .attr("d", path);

  svg.append("path")
      .datum(topojson.feature(topology, topology.objects.counties))
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.3)
      .attr("d", path);
});