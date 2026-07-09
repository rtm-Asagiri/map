fetch("data/navigation/nodes.json")
.then(r=>r.json())
.then(nodes=>{
    window.nodes = nodes;
});


fetch("data/navigation/edges.json")
.then(r=>r.json())
.then(edges=>{
    window.edges = edges;
});
