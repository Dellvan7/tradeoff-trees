
function tradeoffTree(graph, e = 1) {
	adj_list = graph["adj_list"]
	var dist = [];
	var prev = [];
	var visited = {};

	for (node in adj_list) {
		dist[node] = 9007199254740991;
		prev[node] = null;
	}

	source = 0;

	dist[source] = 0;

	var keys = Object.keys(adj_list);
	var heap = binaryHeap();

	for (key in keys){
		heap.push( {"distance": dist[key], "node": key } );
	}
	
	var u; var v; var weight; var altDist;

	while (heap.size() > 0) {

		u = heap.pop();
		distance = u["distance"];
		u = u["node"];
		visited[u] = true;

		for (node in adj_list[u]) {

			if (!(node in visited)){

				v = node;
				weight_uv = adj_list[u][node];
				altDist = ((1-e) * dist[u]) + (e * weight_uv);

				if (altDist < dist[v]) {
					dist[v] = altDist;
					prev[v] = u;

					heap.siftUp(v, altDist);

				}

			}
		}

	}
	
	return [prev, dist];
}



function randomGraph(sparseness = 0.5, nodeCount = 10) {
    var graph = {};


    for (i = 0; i < nodeCount; i++) {
    	graph[i] = {};

    	for (j = 0; j < nodeCount; j++) {

    		if (!graph[j])
    			graph[j] = {};
    		
    		
    		if (i != j && Math.random() < sparseness) {

    			weight = nodeCount * Math.random();
    			graph[i][j] = weight; 
    			graph[j][i] = weight;

			}

    	}

    }

    return graph;
}

function distance(p1, p2) {
	return Math.sqrt( (p1[0]-p2[0])*(p1[0]-p2[0]) + (p1[1]-p2[1])*(p1[1]-p2[1]) );
}

function randomConnectedGraph(sparseness = 0.5, nodeCount = 10) {
	graph = {};
	
	nodes = [];

	for (i = 0; i < nodeCount; i++) {
		nodes[i] = [Math.ceil(Math.random()*nodeCount), Math.ceil(Math.random()*nodeCount)];
	}

	unknown_nodes = [...Array(nodeCount).keys()];

	known_nodes = []

	currentNode = unknown_nodes[Math.floor(Math.random() * unknown_nodes.length)];
	graph[currentNode] = {}

	var neighborNode;
	var index;
	var weight;

	while (unknown_nodes.length) {

		index = Math.floor(Math.random()*unknown_nodes.length);
		neighborNode = unknown_nodes[index];

		weight = distance(nodes[currentNode], nodes[neighborNode]);

		graph[currentNode][neighborNode] = weight;
		graph[neighborNode] = {};
		graph[neighborNode][currentNode] = weight;

		known_nodes.push(unknown_nodes[index]);
		unknown_nodes.splice(index, 1);

		currentNode = neighborNode;
	}

	for (i = 0; i < (nodeCount * sparseness); i++) {

		u = known_nodes[Math.floor(Math.random()*known_nodes.length)];
		v = known_nodes[Math.floor(Math.random()*known_nodes.length)];

		if (u != v) {

			weight = distance(nodes[u], nodes[v]);

			graph[u][v] = weight;
			graph[v][u] = weight;

		}

	}

	return {"nodes" : nodes, "adj_list" : graph};
		
}

function jsonifyTree(tree, graph) {
	prev = tree[0];

	nodes = [];
	links = [];

	for (node in prev){
		nodes.push( { "id": node, "group": node } );
		if (prev[node] != null) {
			links.push( { "source": node, "target": prev[node]} );
		}
	}

	return {nodes, links};

}


function jsonifyGraph(graph) {

	graph_nodes = graph["nodes"];
	adj_list = graph["adj_list"];
	
	nodes = [];
	links = [];


	for (i = 0; i < graph_nodes.length; i++) {
		node = { "id": i, "group": i, "x": graph_nodes[i][0], "y": graph_nodes[i][1] }
		nodes.push( node );

		for (j in adj_list[i]) {

			link = { "source": i, "target": j, "value": adj_list[i][j] };
			links.push( { "source": i, "target": parseInt(j), "value": adj_list[i][j] } );

		}

	}

	return {nodes, links};

}


// var graph = randomGraph(0.4, 10);
// var prims = tradeoffTree(graph, 0);
// var djikstras = tradeoffTree(graph, 1);

// console.log(graph);
// console.log("PRIMS", prims);
// console.log("------------------------------------------")
// console.log("DJIKSTRAS", djikstras);



// jsonifyTree(prims)



 // jsonifyTree(tradeoffTree(randomGraph(0.4, 10), 0));
