import { app, BrowserWindow} from "electron";
import { createWindow } from "./main";
import { updateApplication } from "./updater";

export const run = async () => {
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

  await app.whenReady();
  await createWindow();
  await updateApplication();
};
