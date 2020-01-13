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
    if (exec("svn update /home/cod/cif").code !== 0) {
        return Promise.reject(`Error: Synchronization of CIF from crystallography.net to Disk Failed`);
    }

    log("Syncronize cif to gcs");
    for (let i = 1; i < 10; i++) {
        if (exec(`gsutil -m rsync -r /home/cod/cif/${i} gs://cod-data/cif/${i}`).code !== 0) {
            return Promise.reject(`Error: Synchronization of CIF/${i} to GC`);
        }
    }

    log("Syncronize hkl form crystallography.net");
    if (exec("svn update /home/cod/hkl").code !== 0) {
        return Promise.reject(`Error: Synchronization of HKL from crystallography.net to Disk Failed`);
    }

    log("Syncronize hkl to gcs");
    for (let i = 1; i < 10; i++) {
        if (exec(`gsutil -m rsync -r /home/cod/hkl/${i} gs://cod-data/hkl/${i}`).code !== 0) {
            return Promise.reject(`Error: Synchronization of HKL/${i} to GC`);
        }
    }

    await sendShutDown(context);
}
