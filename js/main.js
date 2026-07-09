map.fitBounds(bounds);
let startNode = null;
let endNode = null;

let routeLine;


// 尋找最近節點
function nearestNode(x,y){

    let best=null;
    let dist=Infinity;

    nodes.forEach(n=>{

        let d=Math.hypot(
            n.x-x,
            n.y-y
        );

        if(d<dist){
            dist=d;
            best=n;
        }

    });

    return best;

}



// 點擊地圖
map.on("click",function(e){


    let x=e.latlng.lng;
    let y=e.latlng.lat;


    let node=nearestNode(x,y);


    if(!startNode){

        startNode=node;

        L.marker(
            [node.y,node.x]
        )
        .addTo(map)
        .bindPopup("起點")
        .openPopup();

    }

    else if(!endNode){

        endNode=node;


        L.marker(
            [node.y,node.x]
        )
        .addTo(map)
        .bindPopup("終點");


        let route=findPath(
            startNode.id,
            endNode.id
        );


        drawRoute(route);

    }

});
function drawRoute(route){


let points=[];


route.forEach(id=>{


    let n=
    nodes.find(
        x=>x.id===id
    );


    points.push([
        n.y,
        n.x
    ]);


});



routeLine=L.polyline(
    points,
    {
        color:"red",
        weight:6
    }
)
.addTo(map);


map.fitBounds(
    routeLine.getBounds()
);


}
let bounds=[
    [0,0],
    [5000,5000]
];


L.imageOverlay(
    "data/map/world.svg",
    bounds
)
.addTo(map);


map.fitBounds(bounds);
function drawNodes(){

    window.nodes.forEach(n=>{

        L.circleMarker(
            [
                n.y,
                n.x
            ],
            {
                radius:4,
                color:"red"
            }
        )
        .addTo(map);

    });

}

window.addEventListener(
    "navigationReady",
    ()=>{

        console.log(
            "節點載入完成:",
            window.nodes.length
        );

        drawNodes();

    }
);
