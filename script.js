const map = L.map('map', {
    crs: L.CRS.Simple,
    zoomControl: false,
    maxZoom: 2,
});

const imageWidth = 8793;
const imageHeight = 4993;
const bounds = [[0, 0], [imageHeight, imageWidth]];

const imageUrl = 'labeledMap.png';
L.imageOverlay(imageUrl, bounds, {
    className: 'pixelated'
}).addTo(map);

map.fitBounds(bounds);
map.setMaxBounds(bounds);

let currentMarker = null;

function updateTaskMarker(task) {
    if (currentMarker) {
        currentMarker.remove();
    }

    if (task && task.coords) {
        const customMarker = L.divIcon({
            className: 'osrs-marker',
            iconSize: [8, 8],
            html: `<div class="osrs-label">${task.text}</div>`,
        });

        currentMarker = L.marker([task.coords.y, task.coords.x], {
            icon: customMarker,
        }).addTo(map);

        map.setView([task.coords.y, task.coords.x]);
        document.getElementById('loading-overlay').style.display = 'none';
    }
}


map.on('mousedown', async (event) => {
    const { lat, lng } = event.latlng;
    console.log(`Mouse Coordinates: {x: ${lng.toFixed(2)}, y: ${lat.toFixed(2)}}`);
    await navigator.clipboard.writeText(`,coords: {x: ${lng.toFixed(2)}, y: ${lat.toFixed(2)}}`);
});
