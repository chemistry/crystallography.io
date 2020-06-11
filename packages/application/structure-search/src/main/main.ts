import commandLineArgs from "command-line-args";
import { BrowserWindow} from "electron";
import * as path from "path";

interface AppOptions {
   "app-host": string;
}

export async function createWindow() {

  const optionDefinitions = [
      { name: "app-host", type: String, defaultValue: "https://crystallography.io" },
  ];
  const options: AppOptions = commandLineArgs(optionDefinitions as any) as any;

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
