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

//parse the year (format full year)
var parseYear = d3.timeParse("%Y")