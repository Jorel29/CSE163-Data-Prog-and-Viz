/*
/ File: MultiLineChart.js
*/

/*
Code below provided by SureshLodha from BarGraphSamplev5.js
=====================================================================================*/
var margin = {top: 10, right: 40, bottom: 150, left: 50},//defining the margins
    width = 760 - margin.left - margin.right, //setting width based on margins
    height = 500 - margin.top - margin.bottom;//setting height based on margins
    

// Define SVG. "g" means group SVG elements together. 
// Add comments here in your own words to explain this segment of code
// select the body and add a svg area that is 760 W x 500 H
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right) // 760 W
    .attr("height", height + margin.top + margin.bottom) // 500H
    .append("g") //add grouped elements to body
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//==================================================================================

//parse the year (format full year) (from D3 API)
var parseYear = d3.timeParse("%Y");

//Following Block is taken from MultiLine V4
//==================================================================================
//computes the scales x and y 
// z is the color scale using 10 different color categories (d3 API)
var x = d3.scaleTime().range([0,width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.energy); });

//modified from MultiLineV4.js
function type(d, _, columns) {
    d.year = parseYear(d.year);
    for (var i = 1, n = columns.length, c; i < n; ++i) 
      d[c = columns[i]] = +d[c];
    return d;
  } 
//==================================================================================
//linechart.js
// gridlines in x axis function
function make_x_gridlines() {		
  return d3.axisBottom(x)
      .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {		
  return d3.axisLeft(y)
      .ticks(5)
}


d3.csv("BRICSdata.csv", type).then(function(data){
    //from MultilineChart.js
    
  //ignore the year column
  var countries = data.columns.slice(1).map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return {year: d.year, energy: d[id]};
        })
      };
    });
  console.log(countries);
  console.log(data);
  console.log(d3.extent(data, function(d) { return d.year; }));
  console.log(d3.min(countries, function(c) { return d3.min(c.values, function(d) { return d.energy; }); }));
  console.log(d3.max(countries, function(c) { return d3.max(c.values, function(d) { return d.energy; }); }))
  
  x.domain(d3.extent(data, function(d) { return d.year; }));

  y.domain([
      d3.min(countries, function(c) { return d3.min(c.values, function(d) { return d.energy; }); }),
      d3.max(countries, function(c) { return d3.max(c.values, function(d) { return d.energy; }); })
  ]);

  z.domain(countries.map(function(c) { return c.id; }));
  
  //linechart.js
  // add the X gridlines
  svg.append("g")			
  .attr("class", "grid")
  .attr("transform", "translate(0," + height + ")")
  .call(make_x_gridlines()
      .tickSize(-height)
      .tickFormat("")
  )

// add the Y gridlines
  svg.append("g")			
    .attr("class", "grid")
    .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat("")
    )

//MultiLineV4
  //x axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  //y axis
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Energy Per Capita, (Millions)");

  var country = svg.selectAll(".country")
    .data(countries)
    .enter().append("g")
      .attr("class", "country");

  var path = country.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return z(d.id); })

  
  //changed the offeset to 2015 as last year because most countries fall to zero after 2015
  country.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 6]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.energy) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });

  var totalLength = path.node().getTotalLength();

  path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
});