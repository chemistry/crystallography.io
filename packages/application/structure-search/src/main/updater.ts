import * as loger from "electron-log";
import { autoUpdater } from "electron-updater";

export const updateApplication: () => Promise<void> = async () => {
  loger.transports.file.level = "debug";
  autoUpdater.logger = loger;
  await autoUpdater.checkForUpdatesAndNotify();
};
