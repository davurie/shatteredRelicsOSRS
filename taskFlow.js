const taskFlow = {
    rows: [],
    currentIndex: 0,
    completedTasksCount: 0,
    completedPointsCount: 0,

    get currentTask() {
        const task = this.rows[this.currentIndex];
        return task && task.type === 'TASK' ? task : {};
    },

    get currentInstructions() {
        let instructions = '';
        let index = this.currentIndex;
        while (index > 0 && this.rows[index - 1].type === 'INSTRUCTION') {
            instructions = `<p>${this.rows[index - 1].text}</p>` + instructions;
            index--;
        }
        return instructions;
    },

    get currentSubsection() {
        let index = this.currentIndex;
        while (index >= 0) {
            if (this.rows[index].type === 'SECTION') {
                return this.rows[index].name;
            }
            index--;
        }
        return '';
    },

    get completedTasks() {
        return this.completedTasksCount;
    },

    get completedPoints() {
        return this.completedPointsCount;
    },

    markAsDone() {
        if (this.currentIndex < this.rows.length) {
            const task = this.currentTask;
            if (task.type === 'TASK') {
                task.completed = true;
                this.completedTasksCount++;
                this.completedPointsCount += task.points || 0;
            }
            this.currentIndex++;
            while (this.currentIndex < this.rows.length && this.rows[this.currentIndex].type !== 'TASK') {
                this.currentIndex++;
            }
            this.saveProgress();
            this.updateUI();
        }
    },

    undo() {

        if (this.currentIndex === 1) return;
        
        if (this.currentIndex > 0) {
            // Step back to the previous task
            this.currentIndex--;
            while (this.currentIndex >= 0 && this.rows[this.currentIndex].type !== 'TASK') {
                this.currentIndex--;
            }

            const task = this.rows[this.currentIndex];
            if (task && task.type === 'TASK' && task.completed) {
                task.completed = false;
                this.completedTasksCount--;
                this.completedPointsCount -= task.points || 0;
            }

            this.saveProgress();
            this.updateUI();
        }
    },

    updateUI() {
        document.getElementById('completed-tasks').textContent = this.completedTasks;
        document.getElementById('total-points').textContent = this.completedPoints;
        document.getElementById('current-subsection').textContent = this.currentSubsection;

        const instructionsElement = document.getElementById('current-instructions');
        instructionsElement.innerHTML = this.currentInstructions;

        const taskElement = document.getElementById('current-task');
        const noteElement = document.getElementById('current-task-note');
        const markDoneButton = document.getElementById('mark-done-btn');
        const undoButton = document.getElementById('undo-btn');

        const currentTask = this.currentTask;

        if (currentTask.text) {
            taskElement.textContent = currentTask.text;
            noteElement.style.display = currentTask.note ? 'block' : 'none';
            noteElement.textContent = currentTask.note || '';
            markDoneButton.style.display = 'inline-block';
            undoButton.style.display = this.currentIndex > 0 ? 'inline-block' : 'none';
        } else {
            taskElement.textContent = 'No more tasks!';
            noteElement.style.display = 'none';
            markDoneButton.style.display = 'none';
            undoButton.style.display = this.completedTasks > 0 ? 'inline-block' : 'none';
        }

        updateTaskMarker(currentTask);
    },

    saveProgress() {
        const progress = {
            currentIndex: this.currentIndex,
            completedTasks: this.completedTasksCount,
            completedPoints: this.completedPointsCount
        };
        localStorage.setItem('taskFlowProgress', JSON.stringify(progress));
    },

    loadProgress() {
        const savedProgress = localStorage.getItem('taskFlowProgress');
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            this.currentIndex = progress.currentIndex || 0;
            this.completedTasksCount = progress.completedTasks || 0;
            this.completedPointsCount = progress.completedPoints || 0;
        }
    },

    reset() {
        localStorage.removeItem('taskFlowProgress');
        location.reload();
    },

    init(data) {
        this.rows = data.map((row, index) => ({
            ...row,
            completed: false,
            id: index
        }));

        this.loadProgress();

        if (this.currentIndex >= this.rows.length || this.rows[this.currentIndex].type !== 'TASK') {
            this.currentIndex = this.rows.findIndex(row => row.type === 'TASK');
            if (this.currentIndex === -1) {
                this.currentIndex = 0;
            }
        }
        this.updateUI();
    }
};

const sampleData = [
    { type: "SECTION", name: "Lumbridge 1", coords: { x: 6555, y: 2210 } },
    { type: "TASK", text: "Finish the Leagues Tutorial", points: 10, coords: { x: 6555, y: 2210 } },
    { type: "TASK", text: "Open the Leagues Menu", points: 10, coords: { x: 6555, y: 2210 } },
    { type: "INSTRUCTION", text: "Use Prayer Settings: Disable level up notifications F Keys, Hide Roofs" },
    { type: "TASK", text: "Pickpocket a man", note: "Till level 5", points: 10, coords: { x: 6555, y: 2210 } },
    { type: "TASK", text: "Ask Hans age", points: 10, coords: { x: 6555, y: 2210 } }
    // Add other rows here...
];

taskFlow.init(sampleData);

document.getElementById('mark-done-btn').addEventListener('click', () => taskFlow.markAsDone());
document.getElementById('undo-btn').addEventListener('click', () => taskFlow.undo());
document.getElementById('reset-btn').addEventListener('click', () => taskFlow.reset());
