import { Firestore } from "@google-cloud/firestore";
import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import {
  DB_NAME,
  STATIC_PATH,
  STORAGE_NAME,
} from "./constants";

const storage = new Storage();
const firestore = new Firestore();

export interface ReleaseInfo {
    id: string;
    resources: {
        css: string;
        js: string;
    };
    name: string;
    date: string;
    version: string;
    path: string;
}

export const getReleases = async (): Promise<ReleaseInfo[]> => {
  return await firestore
    .collection(DB_NAME)
    .limit(100)
    .get()
    .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => doc.data() as ReleaseInfo);
    });
};

async function downloadFile({ name, dest }: {name: string, dest: string }) {
  // tslint:disable-next-line
  console.log("downloading ..", name);
  await storage
    .bucket(STORAGE_NAME)
    .file(name)
    .download({
        destination: dest,
    });
}

async function syncronizeApp(app: ReleaseInfo) {
    const { path, id, version } = app;
    const prefix = `${id}/${version}`;

    const [files] = await storage
      .bucket(STORAGE_NAME)
      .getFiles({
          prefix,
      });

    const dirpath = `${STATIC_PATH}/${path.replace("/", "")}`;
    await fs.promises.mkdir(dirpath, { recursive: true });

    for (const file of files) {
        const { name } = file;
        const fileName = name.replace(prefix, "");

        await downloadFile({
            name: `${name}`,
            dest: `${dirpath}${fileName}`,
        });
    }
}

export const fetchDeployedApps = async (apps: ReleaseInfo[]): Promise<void> => {
    for (const app of apps) {
        await syncronizeApp(app);
    }
};
