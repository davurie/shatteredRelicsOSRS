const taskPanel = document.getElementById('task-panel');
const dragHandle = document.getElementById('drag-handle');
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

function startDrag(e) {
    isDragging = true;
    const event = e.touches ? e.touches[0] : e;
    offsetX = event.clientX - taskPanel.offsetLeft;
    offsetY = event.clientY - taskPanel.offsetTop;
    document.body.style.cursor = 'grabbing';
    taskPanel.style.transition = 'none';
}

function drag(e) {
    if (!isDragging) return;
    const event = e.touches ? e.touches[0] : e;
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;
    taskPanel.style.left = `${x}px`;
    taskPanel.style.top = `${y}px`;
}

function endDrag() {
    if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';
        taskPanel.style.transition = 'top 0.3s, left 0.3s';
        handleDragEnd();
    }
}

function snapToCorner() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const panelRect = taskPanel.getBoundingClientRect();
    const panelWidth = panelRect.width;
    const panelHeight = panelRect.height;

    const distances = {
        NW: Math.hypot(panelRect.left, panelRect.top),
        NE: Math.hypot(windowWidth - panelRect.right, panelRect.top),
        SW: Math.hypot(panelRect.left, windowHeight - panelRect.bottom),
        SE: Math.hypot(windowWidth - panelRect.right, windowHeight - panelRect.bottom),
    };

    const nearestCorner = Object.keys(distances).reduce((a, b) =>
        distances[a] < distances[b] ? a : b
    );

    const cornerPositions = {
        NW: { left: `${rem}px`, top: `${rem}px` },
        NE: { left: `${windowWidth - panelWidth - rem}px`, top: `${rem}px` },
        SW: { left: `${rem}px`, top: `${windowHeight - panelHeight - rem}px` },
        SE: { left: `${windowWidth - panelWidth - rem}px`, top: `${windowHeight - panelHeight - rem}px` }
    };

    const position = cornerPositions[nearestCorner];
    if (position) {
        taskPanel.style.left = position.left;
        taskPanel.style.top = position.top;
    }
}

function snapForMobile() {
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isPortrait) {
        if (taskPanel.offsetTop < window.innerHeight / 2) {
            taskPanel.style.top = `${rem}px`;
        } else {
            taskPanel.style.top = `${window.innerHeight - taskPanel.offsetHeight - rem}px`;
        }
        taskPanel.style.left = `${(window.innerWidth - taskPanel.offsetWidth) / 2}px`;
    } else {
        if (taskPanel.offsetLeft < window.innerWidth / 2) {
            taskPanel.style.left = `${rem}px`;
        } else {
            taskPanel.style.left = `${window.innerWidth - taskPanel.offsetWidth - rem}px`;
        }
        taskPanel.style.top = `${(window.innerHeight - taskPanel.offsetHeight) / 2}px`;
    }
}

function handleDragEnd() {
    if (window.innerWidth < 768) {
        snapForMobile();
    } else {
        snapToCorner();
    }
    savePosition();
}

function savePosition() {
    localStorage.setItem('taskPanelPosition', JSON.stringify({
        top: taskPanel.style.top,
        left: taskPanel.style.left
    }));
}

function loadPosition() {
    const savedPosition = JSON.parse(localStorage.getItem('taskPanelPosition'));
    if (savedPosition) {
        taskPanel.style.top = savedPosition.top;
        taskPanel.style.left = savedPosition.left;
    }
}

dragHandle.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', endDrag);
dragHandle.addEventListener('touchstart', startDrag);
document.addEventListener('touchmove', drag);
document.addEventListener('touchend', endDrag);
window.addEventListener('resize', handleDragEnd);
window.addEventListener('orientationchange', handleDragEnd);
window.addEventListener('DOMContentLoaded', loadPosition);
