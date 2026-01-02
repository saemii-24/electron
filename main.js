const { app, BrowserWindow, Notification } = require("electron");

let win;

function showNotification() {
  new Notification({
    title: "AI Schedule Agent",
    body: "에이전트가 실행되었습니다",
  }).show();
}

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");

  win.once("ready-to-show", () => {
    showNotification();
  });
}

app.whenReady().then(createWindow);
