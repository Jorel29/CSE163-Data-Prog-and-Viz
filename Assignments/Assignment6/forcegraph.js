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



//define the force simulation
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));


d3.json("miserables.json").then(function(graph) {
  console.log(graph)
  console.log(graph.links.length)
  for(var i = 0; i < graph.links.length; i++){
    graph.links[i].strength = 1/(graph.links[i].value*2);
    //console.log(graph.links[i].strength)
    console.log( graph.links[i].source + ", " + graph.links[i].target + ", " + graph.links[i].value + ", " + graph.links[i].strength)
    
  }
  for(var j = 0; j < graph.nodes.length; j++){
    graph.nodes[j].size = 5
    console.log(graph.nodes[j].size)
  }
  console.log(d3.max(graph.links , function(d) {return d.value} ))
  var nodeScale = d3.scaleLinear()
                .range([5, d3.max(graph.links , function(d) {return d.value} ) ])
  
  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", function(d) {return d.size})
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links)
      .strength(function (d){ return d.strength})
      .distance(30);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
});
//corrections made from mike bostock Force Directed Graph from Observable
function dragstarted(event) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  event.subject.fx = event.subject.x;
  event.subject.fy = event.subject.y;
}

function dragged(event) {
  event.subject.fx = event.x;
  event.subject.fy = event.y;
}

function dragended(event) {
  if (!event.active) simulation.alphaTarget(0);
  event.subject.fx = null;
  event.subject.fy = null;
}