console.log("navigation loaded");


window.nodes = [];
window.edges = [];


// 建立完成通知
window.navigationReady = false;


async function loadNavigation(){

    const nodesResponse =
        await fetch("data/navigation/nodes.json");

    window.nodes =
        await nodesResponse.json();



    const edgesResponse =
        await fetch("data/navigation/edges.json");

    window.edges =
        await edgesResponse.json();



    console.log(
        "nodes:",
        window.nodes.length
    );

    console.log(
        "edges:",
        window.edges.length
    );


    window.navigationReady = true;


    window.dispatchEvent(
        new Event("navigationReady")
    );

}


loadNavigation();
