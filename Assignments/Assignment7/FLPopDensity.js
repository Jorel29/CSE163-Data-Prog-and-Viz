//Define Margin
var margin = { left: 80, right: 80, top: 50, bottom: 50 },
    width = 960 - margin.left - margin.right,
    height = 660 - margin.top - margin.bottom;

//Define Color
var color = d3.scaleOrdinal(d3.schemeCategory10);

//Define SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

var projection = d3.geoAlbersUsa()
    .scale(5000)
    .translate([width / 2 - 900, height / 2 - 800]);

var path = d3.geoPath()
    .projection(projection);
//=================================================
//tooltip start
//=================================================   
var tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")

var mouseover = function (event) {
    tooltip
        .style("opacity", 0.8)
        .style("left", (d3.pointer(event)[0]))
        .style("bottom", (d3.pointer(event)[1]))
    d3.select(this)
        .style("opacity", 0.8)
    //console.log(d3.pointer(event))
    //console.log(event.pageX)
    //console.log(d3.pointer(event)[0])
    //console.log(d3.pointer(event)[1])
    //console.log(tooltip.style.top);
}

var mouseout = function () {
    tooltip
        .style("opacity", 0)
    d3.select(this)
        .style("opacity", 1)
}

//=================================================
//tooltip end
//=================================================   
//=================================================
//color button start
//================================================= 
var colorButton = svg.append("g")
    .attr("class", "button")
    .attr("value", "OFF")
    .attr("transform", "translate(0,80)")

colorButton
    .append("rect")
    .attr("height", "20")
    .attr("x", 850)
    .attr("width", "65")
    .attr("rx", "5")
    .attr("fill", "lightgray")
    .attr("stroke", "black")
    .on("mouseover", function () { d3.select(this).style("opacity", 0.8) })
    .on("mouseout", function () { d3.select(this).style("opacity", 1) })
    .on("click", function(){
        var newScheme = d3.scaleThreshold()
                .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
        if (colorButton.attr("value")=="OFF")
        {
            colorButton.attr("value", "ON")
            newScheme = newScheme.range(d3.schemeOrRd[9])
            legend.attr("fill", function(d){return newScheme(d[0])})
            counties.attr("fill", function(d){return newScheme(d.properties.density)})
        }
        else
        {
            colorButton.attr("value", "OFF")
            newScheme = newScheme.range(d3.schemePuBu[9])
            legend.attr("fill", function(d){return newScheme(d[0])})
            counties.attr("fill", function(d){return newScheme(d.properties.density)})
        }
    });

colorButton
    .append("text")
    .attr("x", 865)
    .attr("y", "1.1em")
    .attr("class", "label")
    .attr("fill", "black")
    .text("Color")
    .attr("pointer-events", "none")

var color = d3.scaleThreshold()
    .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
    .range(d3.schemeOrRd[9]);

//=================================================
//color button end
//=================================================
//=================================================
// Built from code from CAPop Density
//=================================================
var x = d3.scaleSqrt()
    .domain([0, 4500])
    .rangeRound([440, 950]);

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");
//data mapping to color range with catches for null values
var legend = g.selectAll("rect")
    .data(color.range().map(function (d) {
        d = color.invertExtent(d);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
    }))
    .enter().append("rect")
    .attr("height", 8)
    .attr("x", function (d) { return x(d[0]); })
    .attr("width", function (d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function (d) { return color(d[0]); });


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

//variables to make the svg graphics avaliable to the global scope
var counties;
var borders;
d3.csv("FLCountiesDensity.csv").then(function (countiesDensity) {
    d3.json("us-10m.json").then(function (topology) {
        //console.log(topology.objects)
        //console.log(topology.objects.counties)
        //console.log(topology.objects.counties.geometries[0].id)
        var topoFLCounties = topology.objects.counties.geometries.filter(function (c) {
            return c.id > 12000 && c.id < 13000;
        })
        topology.objects.counties.geometries = topoFLCounties
        //console.log(topoFLCounties)
        //console.log(topology.objects.counties)
        //Appending density to topology data (IDV for Web)
        for (var i = 0; i < countiesDensity.length; i++) {

            //Grab state name
            var countiesDensityID = countiesDensity[i].id2;
            var name = countiesDensity[i].name;
            //Grab data value, and convert from string to float
            var density = +countiesDensity[i].density;
            //console.log(topoFLCounties.length)
            //Find the corresponding state inside the GeoJSON
            for (var j = 0; j < topoFLCounties.length; j++) {

                var topoState = topoFLCounties[j].id;
                //console.log(topoState +" "+ countiesDensityID)
                if (countiesDensityID == topoState) {

                    //Copy the data value into the JSON
                    topology.objects.counties.geometries[j].properties = { density, name }

                    break;
                }
            }
        }

        //console.log(topology.objects.counties.geometries[0])

        counties = svg.append("g")
            .attr("class", "density")
            .selectAll("path")
            .data(topojson.feature(topology, topology.objects.counties).features)
            .enter().append("path")
            .attr("fill", function (d) {
                return color(d.properties.density);
            })
            .attr("d", path)
            .on("mouseover", mouseover)
            .on("mousemove", function (event, d) {
                tooltip
                    .html(
                        "<div class=\"item\">" +
                        d.properties.name + ":" + d.properties.density +
                        "</div>"
                    )
                    .style("left", (d3.pointer(event)[0]) + "px")
                    .style("top", (d3.pointer(event)[1]) + 25 + "px")
            })
            .on("mouseout", mouseout);

        borders = svg.append("path")
            .attr("class", "counties")
            .datum(topojson.feature(topology, topology.objects.counties))
            .attr("fill", "gray")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 1)
            .attr("d", path);

        
    });
});





