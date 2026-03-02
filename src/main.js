import routeData from "../assets/routeData.json" with { type: "json" };
import { taskFlow } from "./taskFlow.js";

const { register } = window.__TAURI__.globalShortcut;
const { Window } = window.__TAURI__.window;

taskFlow.init(routeData);

const appWindow = Window.getCurrent();

document
  .getElementById("mark-done-btn")
  .addEventListener("click", () => taskFlow.markAsDone());
document
  .getElementById("undo-btn")
  .addEventListener("click", () => taskFlow.undo());

window.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.code === "Space") {
    event.preventDefault();
    taskFlow.markAsDone();
  }
  if (event.shiftKey && event.code === "Space") {
    event.preventDefault();
    if (taskFlow.hasPreviousTask()) taskFlow.undo();
  }
});

document.getElementById("close-btn").addEventListener("click", async () => {
  await appWindow.close();
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

const isUsingTauri = () => {
  return typeof window.__TAURI__ !== "undefined";
};

if (isUsingTauri()) {
  document.getElementById("close-btn").classList.remove("hidden");
  document.getElementById("drag-handle").classList.remove("hidden");

  (async () => {
    await register("CommandOrControl+Space", (event) => {
      if (event.state === "Pressed") {
        taskFlow.markAsDone();
      }
    });

    await register("Shift+Space", (event) => {
      if (event.state === "Pressed") {
        taskFlow.undo();
      }
    });
  })();
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
