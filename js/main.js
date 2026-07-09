// =============================
// main.js
// 只負責導航互動，不建立地圖
// =============================

let startNode = null;
let endNode = null;

let startMarker = null;
let endMarker = null;
let routeLine = null;


// -------------------------
// 找最近節點
// -------------------------
function nearestNode(x, y) {

    let best = null;
    let dist = Infinity;

    window.nodes.forEach(n => {

        const d = Math.hypot(
            n.x - x,
            n.y - y
        );

        if (d < dist) {
            dist = d;
            best = n;
        }

    });

    return best;

}


// -------------------------
// 畫導航線
// -------------------------
function drawRoute(route) {

    if (!route || route.length === 0) {

        alert("找不到路徑");

        return;

    }

    if (routeLine) {

        map.removeLayer(routeLine);

    }

    const points = route.map(id => {

        const n = window.nodes.find(node => node.id === id);

        return [n.y, n.x];

    });

    routeLine = L.polyline(points, {

        color: "red",
        weight: 6

    }).addTo(map);

    map.fitBounds(routeLine.getBounds());

}


// -------------------------
// 畫所有導航節點
// -------------------------
function drawNodes() {

    window.nodes.forEach(n => {

        L.circleMarker(
            [n.y, n.x],
            {
                radius: 4,
                color: "red"
            }
        ).addTo(map);

    });

}


// -------------------------
// 等導航資料載入完成
// -------------------------
window.addEventListener("navigationReady", () => {

    console.log("導航資料完成");

    drawNodes();

});


// -------------------------
// 點地圖開始導航
// -------------------------
map.on("click", function (e) {

    // 如果資料還沒載完
    if (!window.nodes || window.nodes.length === 0) {

        console.warn("導航資料尚未完成");

        return;

    }

    const x = e.latlng.lng;
    const y = e.latlng.lat;

    const node = nearestNode(x, y);

    // ---------- 起點 ----------
    if (!startNode) {

        startNode = node;

        if (startMarker) {

            map.removeLayer(startMarker);

        }

        startMarker = L.marker([node.y, node.x])
            .addTo(map)
            .bindPopup("起點")
            .openPopup();

        return;

    }

    // ---------- 終點 ----------
    if (!endNode) {

        endNode = node;

        if (endMarker) {

            map.removeLayer(endMarker);

        }

        endMarker = L.marker([node.y, node.x])
            .addTo(map)
            .bindPopup("終點");

        const route = findPath(
            startNode.id,
            endNode.id
        );

        drawRoute(route);

        return;

    }

    // ---------- 第三次點擊重新導航 ----------

    startNode = node;
    endNode = null;

    if (routeLine) {

        map.removeLayer(routeLine);
        routeLine = null;

    }

    if (startMarker) {

        map.removeLayer(startMarker);

    }

    if (endMarker) {

        map.removeLayer(endMarker);

        endMarker = null;

    }

    startMarker = L.marker([node.y, node.x])
        .addTo(map)
        .bindPopup("起點")
        .openPopup();

});
