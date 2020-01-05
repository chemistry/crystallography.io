import { PubSub } from "@google-cloud/pubsub";
import { sendShutDown } from "./shutdown";
export interface AppContext {
  pubsub: PubSub;
  log: (message: string) => void;
  exec: (command: string) => { code: number };
}

export async function App(context: AppContext) {
    const { log, exec } = context;

    log("Syncronize cif form crystallography.net");
    for (let i = 1; i < 10; i++) {
      if (exec(`rsync -av --delete rsync://www.crystallography.net/cif/${i}/ /home/cod/cif/${i}/`).code !== 0) {
          return Promise.reject(`Error: Synchronization of CIF/${i} from crystallography.net to Disk Failed`);
      }
    }

    log("Syncronize cif to gcs");
    if (exec("gsutil -m rsync -r /home/cod/cif gs://cod-data/cif").code !== 0) {
        return Promise.reject("Error: Synchronization of HKL from Disk to GCS Bucket failed");
    }

    log("Syncronize hkl form crystallography.net");
    if (exec("rsync -av --delete rsync://www.crystallography.net/hkl/ /home/cod/hkl/").code !== 0) {
        return Promise.reject("Error: Synchronization of HKL from crystallography.net to Disk Failed");
    }

    log("Syncronize hkl to gcs");
    if (exec("gsutil -m rsync -r /home/cod/hkl gs://cod-data/hkl").code !== 0) {
        return Promise.reject("Error: Synchronization of HKL from Disk to GCS Bucket failed");
    }

    await sendShutDown(context);
}
