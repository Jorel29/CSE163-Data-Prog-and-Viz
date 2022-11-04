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
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide()); //added this myself


d3.json("miserables.json").then(function(graph) {
  //console.log(graph)
  //console.log(graph.links.length)
  //set new data links attr strength
  var links = graph.links
  for(var i = 0; i < links.length; i++){
    links[i].strength = 1/(links[i].value);
  }
  
  //button logic help from karthi here
  //further iterated on by me
  var button = d3.select("button");
  button.on("click", function(){
        if(button.attr("value") == "ON"){
          simulation.stop();
          button.attr("value", "OFF")
          //console.log(d3.select("button").attr("value"))
        }
        else{
          simulation.restart();
          button.attr("value", "ON")
          //console.log(button.attr("value"))
        }
    })

  //console.log(graph.nodes)
  //console.log(d3.max(graph.links , function(d) {return d.value} ))
  //creates link lines on the svg as well as store link arrays
  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
  //creates nodes and stores node array
  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", function(d) { //this code is from stack overflow
        d.size = link.filter(function(l){
          //console.log(l.source+ " " + l.target + " " + d.id);
          return l.source == d.id || l.target == d.id;
        }).size();
        //console.log("r:"+d.size);
        var minRadius = 5;
        return minRadius + (d.size)
      } )
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
  
  simulation.force("collision")
      .radius(function (node){
        //console.log("c:" + node.size);
        return node.size + 5}).iterations(5) //iterations is collision resolutions
      .strength(2)//collision force strength

  simulation.force("charge")
      .strength(function(link){return -2*link.value})//repulsion force per node based on value

  simulation.force("link")
      .links(graph.links)
      .strength(function (d){ return d.strength/2})//modify to get desired attraction
      .distance(function (d){ return 1/d.value}); //get closest by having biggest value

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
  event.subject.fx = event.x;//tip from karthi here
  event.subject.fy = event.y;// how these work is when drag ends leave at current position
}
