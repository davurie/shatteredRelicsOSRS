![shattered-relics-starting-route vercel app_ (1)](https://github.com/user-attachments/assets/99b199b2-239b-4e98-a2ef-c4777d55167c)

# TasksMap App

TasksMap is a lightweight task management app developed to guide through the first hour or so of the Shattered Relics Leagues

Run it on your browser [here](https://shattered-relics-starting-route.vercel.app/)!

---

## Features

- **Interactive Pixel-Art Map**: Tasks are marked visually on an interactive pixel-art map.
- **Standalone App (Electron)**:
  - Resizable window with "always on top" mode.
  - Draggable app window using a custom toolbar.
- **Mobile-Friendly**: Fully responsive and optimized for mobile devices.
- **Tutorial Page**: A full-screen overlay tutorial explains app usage and features on the first launch.
- **Hotkey Support**:
  - `Ctrl + Space`: Mark the current task as done.
  - `Shift + Space`: Undo the last marked task.
  - Hotkeys work in the web version if the browser is focused.
- **Static Task Panel**: Fixed task panel ensures consistent button placement for smoother interaction.
- **Toolbar with Key Functionalities**:
  - **Close Button**: Exit the app (standalone app only).
  - **Reset Progress Button**: Clear your progress and start fresh.
  - **Settings Button**: Access the tutorial again.
  - **Drag Handle**: Drag the app window (standalone app only).
- **Persistent Progress**: Saves your progress using `localStorage`, ensuring continuity between sessions.


---

## Installation

Follow the steps below to install and run the app:

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Git](https://git-scm.com/)
- [Electron](https://www.electronjs.org/)

### Clone the Repository

```bash
git clone https://github.com/your-username/tasksmap.git
cd tasksmap
npm install
```
### Package the app using Electron Packager:

```bash
npx electron-packager . LeaguesStarterTasks --platform=win32 --arch=x64 --out=dist --overwrite --icon=assets/icons/app-icon.ico
```

### Replace win32 and x64 with your target platform and architecture. For example:

- `win32` for Windows
- `darwin` for macOS
- `linux` for Linux
Locate the built app in the \dist folder.
