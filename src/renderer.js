
let currentMarker = null;

const map = L.map("map", {
  crs: L.CRS.Simple,
  zoomControl: false,
  maxZoom: 2,
  minZoom: -2,
});

const fullWidth = 19456;
const fullHeight = 16896;

const xCuts = [0, 6485, 12970, 19456];
const yCuts = [0, 5632, 11264, 16896];

const bounds = [
  [0, 0],
  [fullHeight, fullWidth],
];

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const yTop = yCuts[3 - row - 1];
    const yBottom = yCuts[3 - row];
    const xLeft = xCuts[col];
    const xRight = xCuts[col + 1];

    const tileBounds = [
      [yTop, xLeft],
      [yBottom, xRight],
    ];

    const url = `./assets/rs3_tiles_png/tile_${row}_${col}.avif`;
    L.imageOverlay(url, tileBounds, { className: "pixelated" }).addTo(map);
  }
}

map.fitBounds(bounds);
map.setMaxBounds(bounds);

function updateTaskMarker(task) {
  if (currentMarker) {
    currentMarker.remove();
  }

  if (task && task.coords) {
    const customMarker = L.divIcon({
      className: "rs3-marker",
      iconSize: [8, 8],
      html: `<div class="rs3-label">${task.text}</div>`,
    });

    currentMarker = L.marker([task.coords.y, task.coords.x], {
      icon: customMarker,
    }).addTo(map);

    map.setView([task.coords.y, task.coords.x], 0);

    document.getElementById("loading-overlay").style.display = "none";
  }
}

