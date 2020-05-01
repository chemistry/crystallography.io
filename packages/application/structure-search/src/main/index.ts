// Modules to control application life and create native browser window
import { app, BrowserWindow} from "electron";
import * as path from "path";

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
