var svg_graph = d3.selectAll("svg").filter(".graph"),
    width = +svg_graph.attr("width"),
    height = +svg_graph.attr("height");


var svg_prims = d3.selectAll("svg").filter(".prims"),
    width = +svg_prims.attr("width"),
    height = +svg_prims.attr("height");


var svg_djikstras = d3.selectAll("svg").filter(".djikstras"),
    width = +svg_djikstras.attr("width"),
    height = +svg_djikstras.attr("height");


var color = d3.scaleOrdinal(d3.schemeCategory20);

var graph_simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

var prims_simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

var djikstras_simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));


var graphSetup = function(graph, svg, simulation) {
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
      .attr("cx", function(d){ return d.x; })
      .attr("cy", function(d){ return d.y; })
      .attr("r", 10)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  var label = svg.selectAll(".nodes")
                    .data(graph.nodes)
                    .enter()
                    .append("text")
                    .text(function (d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    label
        .attr("x", function(d){ return d.x; })
        .attr("y", function (d) {return d.y + 3; });
  }
};

var graph = randomConnectedGraph(0.9, 10);
var djikstras = jsonifyTree(tradeoffTree(graph, .5), graph);
var prims = jsonifyTree(tradeoffTree(graph, 1), graph);

// console.log("prims == djikstras", djikstras === prims);

graphSetup(jsonifyGraph(graph), svg_graph, graph_simulation);
graphSetup(prims, svg_prims, prims_simulation);
graphSetup(djikstras, svg_djikstras, djikstras_simulation);


function dragstarted(d) {
  // console.log(d);
  if (!d3.event.active) graph_simulation.alphaTarget(0.01).restart();
  if (!d3.event.active) prims_simulation.alphaTarget(0.01).restart();
  if (!d3.event.active) djikstras_simulation.alphaTarget(0.01).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) graph_simulation.alphaTarget(0);
  if (!d3.event.active) prims_simulation.alphaTarget(0);
  if (!d3.event.active) djikstras_simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}