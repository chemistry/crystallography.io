import { app, BrowserWindow} from "electron";
import * as path from "path";
import { updateApplication } from "./updater";

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
    },
  });

  win.on("ready-to-show", () => {
    win.show();
  });
  // await win.loadFile(path.join(__dirname, "../renderer/index.html"));

  await win.loadURL("https://crystallography.io");
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

(async () => {
  await app.whenReady();
  await createWindow();

})();

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
