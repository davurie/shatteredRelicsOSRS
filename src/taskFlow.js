export const taskFlow = {
  rows: [],
  currentIndex: 0,
  completedTasksCount: 0,
  completedPointsCount: 0,
  firstTaskIndex: 0,

  prevTaskIndex() {
    for (let i = this.currentIndex - 1; i >= 0; i--) {
      if (this.rows[i].type === "TASK") return i;
    }
    return -1;
  },

  hasPreviousTask() {
    return this.prevTaskIndex() !== -1;
  },

  get currentTask() {
    const task = this.rows[this.currentIndex];
    return task && task.type === "TASK" ? task : {};
  },

  get currentInstructions() {
    let instructions = "";
    let index = this.currentIndex;
    while (index > 0 && this.rows[index - 1].type === "INSTRUCTION") {
      instructions = `<p>${this.rows[index - 1].text}</p>` + instructions;
      index--;
    }
    return instructions;
  },

  get currentSubsection() {
    let index = this.currentIndex;
    while (index >= 0) {
      if (this.rows[index].type === "SECTION") {
        return this.rows[index].name;
      }
      index--;
    }
    return "";
  },

  get completedTasks() {
    return this.completedTasksCount;
  },

  get completedPoints() {
    return this.completedPointsCount;
  },

  markAsDone() {
    console.log('markAsDone0')

    if (this.currentIndex < this.rows.length) {
      const task = this.currentTask;
      if (task.type === "TASK" && !task.completed) {
        task.completed = true;
        this.completedTasksCount++;
        this.completedPointsCount += task.points || 0;
      }
      this.currentIndex++;
      while (
        this.currentIndex < this.rows.length &&
        this.rows[this.currentIndex].type !== "TASK"
      ) {
        this.currentIndex++;
      }
      this.saveProgress();
      this.updateUI();
    }
  },

  undo() {
    console.log('undo')
    const prev = this.prevTaskIndex();
    if (prev === -1) return;

    this.currentIndex = prev;

    const task = this.rows[this.currentIndex];
    if (task && task.type === "TASK" && task.completed) {
      task.completed = false;
      this.completedTasksCount--;
      this.completedPointsCount -= task.points || 0;
    }

    this.saveProgress();
    this.updateUI();
  },

  updateUI() {
    document.getElementById("current-subsection").textContent =
      this.currentSubsection;

    document.getElementById("current-instructions").innerHTML =
      this.currentInstructions;

    const taskElement = document.getElementById("current-task");
    const noteElement = document.getElementById("current-task-note");
    const markDoneButton = document.getElementById("mark-done-btn");
    const undoButton = document.getElementById("undo-btn");

    const currentTask = this.currentTask;

    if (currentTask.text) {
      taskElement.innerHTML = currentTask.text;
      noteElement.style.display = currentTask.note ? "block" : "none";
      noteElement.innerHTML = currentTask.note || "";

      markDoneButton.disabled = false;
      undoButton.disabled = !this.hasPreviousTask();
    } else {
      taskElement.textContent = "No more tasks here! Have fun!";
      noteElement.style.display = "none";

      markDoneButton.disabled = true;
      undoButton.disabled = !(
        this.completedTasks > 0 && this.hasPreviousTask()
      );
    }

    updateTaskMarker(currentTask);
  },

  saveProgress() {
    const progress = {
      currentIndex: this.currentIndex,
      completedTasks: this.completedTasksCount,
      completedPoints: this.completedPointsCount,
    };
    localStorage.setItem("taskFlowProgress", JSON.stringify(progress));
  },

  loadProgress() {
    const savedProgress = localStorage.getItem("taskFlowProgress");
    if (savedProgress) {
      const p = JSON.parse(savedProgress);
      this.currentIndex = p.currentIndex ?? 0;
      this.completedTasksCount = p.completedTasks ?? 0;
      this.completedPointsCount = p.completedPoints ?? 0;
    }
  },

  init(data) {
    this.rows = data.map((row, index) => ({
      ...row,
      completed: false,
      id: index,
    }));

    this.firstTaskIndex = this.rows.findIndex((row) => row.type === "TASK");

    this.loadProgress();

    if (
      this.currentIndex >= this.rows.length ||
      this.rows[this.currentIndex].type !== "TASK"
    ) {
      this.currentIndex = this.firstTaskIndex !== -1 ? this.firstTaskIndex : 0;
    }

    if (this.firstTaskIndex !== -1 && this.currentIndex < this.firstTaskIndex) {
      this.currentIndex = this.firstTaskIndex;
    }

    this.updateUI();
  },
};
