console.log("navigation loaded");


window.nodes=[];
window.edges=[];


async function loadNavigation(){

    try{

        const nodes =
            await fetch(
            "./data/navigation/nodes.json"
            )
            .then(r=>r.json());


        const edges =
            await fetch(
            "./data/navigation/edges.json"
            )
            .then(r=>r.json());


        // 過濾錯誤節點
        window.nodes =
            nodes.filter(
                n =>
                n.x!=null &&
                n.y!=null
            );


        window.edges=edges;


        console.log(
            "nodes:",
            window.nodes.length
        );

        console.log(
            "edges:",
            window.edges.length
        );


        window.dispatchEvent(
            new Event(
            "navigationReady"
            )
        );


    }
    catch(e){

        console.error(
            "navigation error",
            e
        );

    }

}


loadNavigation();
