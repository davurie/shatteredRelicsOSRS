const taskPanel = document.getElementById('task-panel');
const dragHandle = document.getElementById('drag-handle');
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

// Start dragging
function startDrag(event) {
    isDragging = true;
    const e = event.touches ? event.touches[0] : event;
    offsetX = e.clientX - taskPanel.offsetLeft;
    offsetY = e.clientY - taskPanel.offsetTop;
    document.body.style.cursor = 'grabbing';
    taskPanel.style.transition = 'none';
}

// Drag the panel
function drag(event) {
    if (!isDragging) return;
    const e = event.touches ? event.touches[0] : event;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    taskPanel.style.left = `${x}px`;
    taskPanel.style.top = `${y}px`;
}

// End dragging and snap to position
function endDrag() {
    if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';
        taskPanel.style.transition = 'top 0.3s, left 0.3s';
        handleDragEnd();
    }
}

// Snap to the nearest corner for larger screens
function snapToCorner() {
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const panelRect = taskPanel.getBoundingClientRect();
    const { width: panelWidth, height: panelHeight } = panelRect;

    // Calculate distances to each corner
    const distances = {
        NW: Math.hypot(panelRect.left, panelRect.top),
        NE: Math.hypot(windowWidth - panelRect.right, panelRect.top),
        SW: Math.hypot(panelRect.left, windowHeight - panelRect.bottom),
        SE: Math.hypot(windowWidth - panelRect.right, windowHeight - panelRect.bottom),
    };

    // Find the nearest corner
    const nearestCorner = Object.keys(distances).reduce((a, b) =>
        distances[a] < distances[b] ? a : b
    );

    // Position for each corner
    const cornerPositions = {
        NW: { left: rem, top: rem },
        NE: { left: windowWidth - panelWidth - rem, top: rem },
        SW: { left: rem, top: windowHeight - panelHeight - rem },
        SE: { left: windowWidth - panelWidth - rem, top: windowHeight - panelHeight - rem },
    };

    // Apply the nearest corner position
    const { left, top } = cornerPositions[nearestCorner];
    taskPanel.style.left = `${left}px`;
    taskPanel.style.top = `${top}px`;
}

// Snap for mobile devices (centered on edges)
function snapForMobile() {
    const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
    const isPortrait = windowHeight > windowWidth;

    if (isPortrait) {
        // Snap to top or bottom
        taskPanel.style.top = taskPanel.offsetTop < windowHeight / 2 ? `${rem}px` : `${windowHeight - taskPanel.offsetHeight - rem}px`;
        taskPanel.style.left = `${(windowWidth - taskPanel.offsetWidth) / 2}px`;
    } else {
        // Snap to left or right
        taskPanel.style.left = taskPanel.offsetLeft < windowWidth / 2 ? `${rem}px` : `${windowWidth - taskPanel.offsetWidth - rem}px`;
        taskPanel.style.top = `${(windowHeight - taskPanel.offsetHeight) / 2}px`;
    }
}

// Handle drag end and decide snapping logic
function handleDragEnd() {
    if (window.innerWidth < 768) {
        snapForMobile();
    } else {
        snapToCorner();
    }
    savePosition();
}

// Save position to localStorage
function savePosition() {
    const position = {
        top: taskPanel.style.top,
        left: taskPanel.style.left,
    };
    localStorage.setItem('taskPanelPosition', JSON.stringify(position));
}

// Load position from localStorage
function loadPosition() {
    const savedPosition = JSON.parse(localStorage.getItem('taskPanelPosition'));
    if (savedPosition) {
        taskPanel.style.top = savedPosition.top;
        taskPanel.style.left = savedPosition.left;
    } else {
        handleDragEnd(); // Snap to default if no position is saved
    }
}

// Attach event listeners
function addEventListeners() {
    dragHandle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    dragHandle.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', endDrag);
    window.addEventListener('resize', handleDragEnd);
    window.addEventListener('orientationchange', handleDragEnd);
    window.addEventListener('DOMContentLoaded', loadPosition);
}

// Initialize
addEventListeners();
