import "dotenv/config";
import { app, BrowserWindow, Notification, ipcMain } from "electron";
import { askGemini } from "./gemini.js";
import { authorizeCalendar } from "./calendar.js";

let win;

function showNotification(message = "에이전트가 실행되었습니다") {
  new Notification({
    title: "AI Schedule Agent",
    body: message,
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

ipcMain.handle("ask-gemini", async (event, userInput) => {
  console.log("Gemini 요청:", userInput);

  const result = await askGemini(userInput);

  showNotification(result.slice(0, 50));

  return result;
});

ipcMain.handle("google-auth", async () => {
  const result = await authorizeCalendar();
  return result;
});
app.whenReady().then(createWindow);
