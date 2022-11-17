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

var projection = d3.geoAlbersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

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

d3.csv("FLCountiesDensity.csv").then(function(countiesDensity){
    d3.json("us-10m.json").then(function(topology) {
        var topoFL = topology.objects
    //Appending density to topology data (IDV for Web)
    for (var i = 0; i < countiesDensity.length; i++) {
				
        //Grab state name
        var countiesDensityID = countiesDensity[i].id;
        
        //Grab data value, and convert from string to float
        var countiesDensityValue = +countiesDensity[i].density;

        //Find the corresponding state inside the GeoJSON
        for (var j = 0; j < topology.objects.length; j++) {
        
            var topoState = topology.features[j].id;

            if (countiesDensityID == topoState) {
        
                //Copy the data value into the JSON
                topology.features[j].properties.density = countiesDensityValue;
                
                //Stop looking through the JSON
                break;
                
            }
        }		
    }

    console.log(topology.objects.counties)

    svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(topology, topology.objects.counties).features)
        .enter().append("path")
        .attr("fill", function(d) { return color(d.properties.density); })
        .attr("d", path);

    svg.append("path")
        .datum(topojson.feature(topology, topology.objects.counties))
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-opacity", 0.3)
        .attr("d", path);
    });
});