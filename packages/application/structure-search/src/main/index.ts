import * as commandLineArgs from "command-line-args";
import { app, BrowserWindow} from "electron";
import * as path from "path";
import { updateApplication } from "./updater";

interface AppOptions {
   "app-host": string;
}
const optionDefinitions = [
    { name: "app-host", type: String, defaultValue: "https://crystallography.io" },
];
const options: AppOptions = commandLineArgs(optionDefinitions) as any;

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

  const appHost = options["app-host"];
  // tslint:disable-next-line
  console.log(`Opening application at following host: ${appHost}`);

  try {
      await win.loadURL(appHost);
  } catch (e) {
      // console.log(e);
      // Load Simple Fallback URL
      await win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

(async () => {
  await app.whenReady();
  await createWindow();
  await updateApplication();
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
