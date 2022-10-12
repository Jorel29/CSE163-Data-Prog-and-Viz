/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Contructs the Bar Graph using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 

// Search "D3 Margin Convention" on Google to understand margins.
// Add comments here in your own words to explain the margins below
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
    //shift position based on the margin.left and margin.top
/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.
// Add comments in your own words to explain the code below
//scale each bar band and determine their range to nearest whole number based on width
//small padding 0.1 between each band
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
//linear scale for y that goes to height
var yScale = d3.scaleLinear().range([height, 0]);

// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign
var xAxis = d3.axisBottom(xScale);


//y axis 
var yAxis = d3.axisLeft(y)
                .scale(yScale)
                .ticks(5, "$") 



/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 

// data.csv contains the country name(key) and its GDP(value)
// d.key and d.value are very important commands
// You must provide comments here to demonstrate your understanding of these commands

// Below we are taking the csv row and splitting them into a key and value 
// because each row contains a country name (or the axis label) and the 
// number value (label as gdp because of the key value of the first row)
function rowConverter(data) {
    return {
        key : data.key,
        value : +data.value
    }
}
//csv function that takes the csv file and then we run the data through
//the code that is in brackets after .then(function(data))
d3.csv("GDP2022TrillionUSDollars.csv", rowConverter).then(function(data){
    
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.)
    // xScale.domain (x parameter for the area) is the based on the 
    // insertion order of d.key (from data.key)
    // yScale.domain is the max height of all d.values
    xScale.domain(data.map(function(d){ return d.key; }));
    yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    
    // Creating rectangular bars to represent the data. 
    // Add comments to explain the code below
    svg.selectAll("rect") // find any instance of "rect"
        .data(data)//allows parses the variable data 
        .enter()
        .append("rect") //adding rects within and towards the end of
                        // the "rect" that is selected from selectAll
        .transition().duration(1000) //transition function with delay of 1000 (ms)
        .delay(function(d,i) {return i * 200;}) //staggered delay based on i
        .attr("x", function(d) { //setting the x axis to input data d.key
            return xScale(d.key);
        })
        .attr("y", function (d) { //setting the y axis to input data d.value
            return yScale(d.value);
        })
        .attr("width", xScale.bandwidth()) //set bar width of each bar based on .bandwidth()
        .attr("height", function (d) {//set the height of each bar based on d.value
			 return height- yScale(d.value);
        })
        // create increasing to decreasing shade of blue as shown on the output
		.attr("fill", function (d) {
             return "rgb(0, 0, " + d.value + ")"; // Blue value of RGB is based on d.value         
        });
    
    // Label the data values(d.value)
    svg.selectAll("text")
			   .data(data)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return d;
			   })
			   .attr("x", function(d, i) {
			   		return i * (w / dataset.length) + 5;
			   })
			   .attr("y", function(d) {
			   		return h - d.value
			   })
    
    // Draw xAxis and position the label at -60 degrees as shown on the output 
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .style("text-anchor", "end")
        .attr("font-size", "10px");
        
    
    // Draw yAxis and position the label
               
      
});
