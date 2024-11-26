let currentMarker = null;

const map = L.map('map', {
    crs: L.CRS.Simple,
    zoomControl: false,
    maxZoom: 2,
});

const bounds = [[0, 0], [4993, 8793]];
L.imageOverlay('./assets/labeledMap.png', bounds, {
    className: 'pixelated',
}).addTo(map);

map.fitBounds(bounds);
map.setMaxBounds(bounds);

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

        map.setView([task.coords.y, task.coords.x], 1);

        document.getElementById('loading-overlay').style.display = 'none';
    }
}

document.getElementById('close-btn').addEventListener('click', () => {
    window.close();
});

document.getElementById('reset-btn').addEventListener('click', (event) => {
    if (confirm('Are you sure you want to reset progress?')) {
        localStorage.clear();
        location.reload();
    }
});

const isElectron = () => {
    return (
        typeof process !== 'undefined' &&
        process.versions != null &&
        process.versions.electron != null
    ) || navigator.userAgent.includes("Electron");
};

if (isElectron()) {
    window.electronAPI.onMarkTaskDone(() => {
        taskFlow.markAsDone();
    });

    window.electronAPI.onMarkTaskUndo(() => {
        taskFlow.undo();
    });
} else {
    window.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.code === 'Space') {
            event.preventDefault();
            taskFlow.markAsDone();
        }

        if (event.shiftKey && event.code === 'Space') {
            event.preventDefault();
            taskFlow.undo();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('tutorial-overlay');
    const closeBtn = document.getElementById('close-tutorial-btn');

    const tutorialViewed = localStorage.getItem('tutorialViewed');

    if (!tutorialViewed) {
        overlay.classList.remove('hidden');
    }

    closeBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        localStorage.setItem('tutorialViewed', 'true');
    });

});
