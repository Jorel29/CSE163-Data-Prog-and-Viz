    var scatterdataset = [ {
        "name": "United States",
        "country": "United States",
        "gdp": 14.9,
        "epc": 317,
        "total": 98.9
    }, {

        "name": "China",
        "country": "China",
        "gdp": 5.93,
        "epc": 76,
        "total": 103
    }, {
        "name": "Japan",
        "country": "Japan",
        "gdp": 5.49,
        "epc": 171, 
        "total": 21.7
    }, {
        "name": "Germany",
        "country": "Germany",
        "gdp": 3.28,
        "epc": 171,
        "total": 14.1
    }, {
        "name": "France",
        "country": "France",
        "gdp": 2.54,
        "epc": 170,
        "total": 10.7
    }, {
        "name": "United Kingdom",
        "country": "United Kingdom",
        "gdp": 2.28,
        "epc": 143,
        "total": 8.8
    }, {
        "name": "Brazil",
        "country": "Brazil",
        "gdp": 2.14,
        "epc": 58,
        "total": 11.3
    }, {
        "name": "Italy",
        "country": "Italy",
        "gdp": 2.04,
        "epc": 126,
        "total": 7.6
    }, {
        "name": "India",
        "country": "India",
        "gdp": 1.70,
        "epc": 19,
        "total": 22.9
    }, {
        "name": "Canada",
        "country": "Canada",
        "gdp": 1.57,
        "epc": 385,
        "total": 13.1
    }, {
        "name": "Russian Federation",
        "country": "Russian Federation",
        "gdp": 1.52,
        "epc": 206,
        "total": 29.5
    }, {

        "name": "Spain",
        "country": "Spain",
        "gdp": 1.37,
        "epc": 134,
        "total": 6.1
    }, {
        "name": "Australia",
        "country": "Australia",
        "gdp": 1.14,
        "epc": 270,
        "total": 6.0
    }, {
        "name": "Mexico",
        "country": "Mexico",
        "gdp": 1.04,
        "epc": 65,
        "total": 7.6
    }, {
        "name": "Korea",
        "country": "Korea",
        "gdp": 1.01,
        "epc": 222,
        "total": 10.7
    }];

    //Define Margin
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color
    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    //Define SVG
      var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Define Scales   
    var xScale = d3.scaleLinear()
         //Need to redefine this later after loading the data
        .range([0, width]);

    var yScale = d3.scaleLinear()
         //Need to redfine this later after loading the data
        .range([height, 0]);
    
    //Define Tooltip here
    var tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
    
    var mouseover = function(event, d) {
        tooltip
            .style("opacity", 0.8)
            .style("left", d3.pointer(event)[0] + "px")
            .style("top", d3.pointer(event)[1] + "px")
        d3.select(this)
            .style("opacity", 0.8)
        console.log(d3.pointer(event))
        console.log(event.pageX)
        console.log(d3.pointer(event)[0])
        console.log(d3.pointer(event)[1])
        //console.log(tooltip.style.top);
        }
    var mousemove = function(event, d) {
    tooltip
        .html("<center>" + d.country + "</center>"+
            "<div class=\"item\">"+
                "<p class=\"left\">Population<p><p class=\"center\">:<p><p class=\"right\">"+d.population+"</p>"+
            "</div>"+
            "<div class=\"item\">"+
            "<p class=\"left\">GDP<p><p class=\"center\">:<p><p class=\"right\">"+d.gdp+"</p>"+
            "</div>")
        
        .style("left", (d3.pointer(event)[0]) + "px")
        .style("top", (d3.pointer(event)[1]) + "px")
    }
    var mouseout = function(d) {
    tooltip
        .style("opacity", 0)
    d3.select(this)
        .style("opacity", 1)
    }
      
       //Define Axis
    var xAxis = d3.axisBottom(xScale)
       .ticks(width*2/height*2)
       .tickSize(8)
       
   
   var yAxis = d3.axisLeft(yScale)
       .ticks(10)
       .tickSize(5)
       .tickPadding(0);
    
    //Get Data
    function parse(d) {
        return{
          country: d.country,
          gdp: +d.gdp,
          population: +d.population,
          ecc: +d.ecc,
          ec: +d.ec
        }
      }
d3.csv("scatterdata.csv", parse).then(function(data){
    console.log(data);
    //console.log(countries);
    // Define domain for xScale and yScale
    console.log(d3.min(data, function(d) { return d.gdp; }));

    xScale.domain([0,width/50]);

    yScale.domain([
      0,
      height
    ]);
    
    //z.domain(countries.map(function(c) { return c.id; }));
    //Draw Scatterplot
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {return d.ec})
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.ecc);})
        .style("fill", function (d) { return colors(d.country); })
        //Add .on("mouseover", .....
        //Add Tooltip.html with transition and style
        //Then Add .on("mouseout", ....
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);
    
    
    //Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom

    var zoom = d3.zoom()
      .scaleExtent([1, 5])
      .on("zoom", zoomed)
    function zoomed(event) {
        //svg.selectAll("text").attr("transform", event.transform);
        //svg.selectAll("circle").attr("transform",event.transform);
        svg.attr("transform", event.transform);
        gX.call(xAxis.scale(event.transform.rescaleX(xScale)));
        gY.call(yAxis.scale(event.transform.rescaleY(yScale)));
    }

    svg.call(zoom);


    //Draw Country Names
    svg.selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.ecc);})
        .style("fill", "black")
        .text(function (d) {return d.country; });

 //x-axis
    var gX = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
            .attr("class", "label")
            .attr("y", 50)
            .attr("x", width/2)
            .style("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-size", "12px")
            .text("GDP (in Trillion US Dollars) in 2010");

    //Y-axis
    var gY = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -50)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("fill", "black")
            .attr("font-size", "12px")
            .text("Energy Consumption per Capita (in Million BTUs per person)");
    
});
