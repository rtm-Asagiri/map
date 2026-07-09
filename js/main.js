let startNode=null;
let endNode=null;

let startMarker=null;
let endMarker=null;
let routeLine=null;



function nearestNode(x,y){

    let best=null;
    let dist=Infinity;


    window.nodes.forEach(n=>{


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



function drawNodes(){


    window.nodes.forEach(n=>{


        L.circleMarker(
            [
                n.y,
                n.x
            ],
            {
                radius:3,
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
"導航完成"
);


drawNodes();


});





map.on(
"click",
function(e){


if(
!window.nodes.length
){

console.log(
"nodes未完成"
);

return;

}



const node =
nearestNode(
e.latlng.lng,
e.latlng.lat
);



if(!node)
return;



// 第一次點
if(!startNode){


startNode=node;


startMarker=
L.marker(
[node.y,node.x]
)
.addTo(map)
.bindPopup(
"起點"
)
.openPopup();


return;

}



// 第二次點
if(!endNode){


endNode=node;


endMarker=
L.marker(
[node.y,node.x]
)
.addTo(map)
.bindPopup(
"終點"
);



const route =
findPath(
startNode.id,
endNode.id
);


drawRoute(route);



return;

}




});






function drawRoute(route){


if(!route)
return;



const points =
route.map(id=>{


let n=
window.nodes.find(
x=>x.id===id
);


return [
n.y,
n.x
];


});



routeLine=
L.polyline(
points,
{
color:"red",
weight:5
}
)
.addTo(map);



map.fitBounds(
routeLine.getBounds()
);


}
