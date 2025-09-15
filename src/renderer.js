
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

document.getElementById("close-btn").addEventListener("click", () => {
  window.close();
});

document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset progress?")) {
    localStorage.clear();
    location.reload();
  }
});

document.getElementById("settings-btn").addEventListener("click", () => {
  document.getElementById("tutorial-overlay").classList.remove("hidden");
});

const isElectron = () => {
  return (
    (typeof process !== "undefined" &&
      process.versions != null &&
      process.versions.electron != null) ||
    navigator.userAgent.includes("Electron")
  );
};

if (isElectron()) {
  document.getElementById("close-btn").classList.remove("hidden");
  document.getElementById("drag-handle").classList.remove("hidden");

  window.electronAPI.onMarkTaskDone(() => {
    taskFlow.markAsDone();
  });

  window.electronAPI.onMarkTaskUndo(() => {
    taskFlow.undo();
  });
} else {
  window.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.code === "Space") {
      event.preventDefault();
      taskFlow.markAsDone();
    }

    if (event.shiftKey && event.code === "Space") {
      event.preventDefault();
      taskFlow.undo();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("tutorial-overlay");
  const closeBtn = document.getElementById("close-tutorial-btn");

  const tutorialViewed = localStorage.getItem("tutorialViewed");

  if (!tutorialViewed) {
    overlay.classList.remove("hidden");
  }

  closeBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    localStorage.setItem("tutorialViewed", "true");
  });
});
