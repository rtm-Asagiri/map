console.log("navigation loaded");


window.nodes = [];
window.edges = [];

window.graph = {};



async function loadNavigation(){

    try{


        let nodes =
        await fetch(
            "./data/navigation/nodes.json"
        )
        .then(r=>r.json());


        let edges =
        await fetch(
            "./data/navigation/edges.json"
        )
        .then(r=>r.json());



        // 移除錯誤節點
        window.nodes =
        nodes.filter(
            n =>
            n.x !== null &&
            n.y !== null
        );



        // 移除錯誤道路
        window.edges =
        edges.filter(
            e =>
            e.distance !== null
        );



        console.log(
            "nodes:",
            window.nodes.length
        );


        console.log(
            "edges:",
            window.edges.length
        );



        buildGraph();



        window.dispatchEvent(
            new Event(
                "navigationReady"
            )
        );


    }
    catch(err){

        console.error(
            "navigation error",
            err
        );

    }


}



function buildGraph(){


    window.graph={};



    window.nodes.forEach(n=>{

        window.graph[n.id]=[];

    });



    window.edges.forEach(e=>{


        // 雙向道路

        window.graph[e.from].push({

            id:e.to,

            cost:e.distance

        });



        window.graph[e.to].push({

            id:e.from,

            cost:e.distance

        });



    });


    console.log(
        "graph ready",
        window.graph
    );


}




// =====================
// A*
// =====================


function heuristic(a,b){


    const na =
    window.nodes.find(
        n=>n.id===a
    );


    const nb =
    window.nodes.find(
        n=>n.id===b
    );


    return Math.hypot(
        na.x-nb.x,
        na.y-nb.y
    );


}




function findPath(start,end){


    let open=[
        start
    ];


    let cameFrom={};


    let gScore={};

    let fScore={};



    window.nodes.forEach(n=>{

        gScore[n.id]=Infinity;
        fScore[n.id]=Infinity;

    });



    gScore[start]=0;


    fScore[start]
    =
    heuristic(
        start,
        end
    );




    while(open.length){



        // 找最低 f

        open.sort(
            (a,b)=>
            fScore[a]-fScore[b]
        );


        let current =
        open.shift();



        if(current===end){


            let path=[
                current
            ];


            while(
                cameFrom[current]
            ){

                current =
                cameFrom[current];


                path.unshift(
                    current
                );

            }


            return path;

        }





        window.graph[current]
        .forEach(next=>{


            let newCost =
            gScore[current]
            +
            next.cost;



            if(
                newCost <
                gScore[next.id]
            ){


                cameFrom[next.id]
                =
                current;



                gScore[next.id]
                =
                newCost;



                fScore[next.id]
                =
                newCost
                +
                heuristic(
                    next.id,
                    end
                );



                if(
                    !open.includes(
                        next.id
                    )
                ){

                    open.push(
                        next.id
                    );

                }


            }


        });



    }


    console.warn(
        "找不到路徑"
    );


    return null;


}





loadNavigation();
