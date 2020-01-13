// tslint:disable:no-console
import {
  parse,
} from "@chemistry/cif-2-json";
import {
  BucketEventData,
  // ,PubSubContext
} from "@chemistry/common-functions";
import { Firestore } from "@google-cloud/firestore";
import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import { cleanupJCif } from "./helpers";

const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

const storage = new Storage();
const bucket = storage.bucket("cod-data");
const firestore = new Firestore();
/**
 * Will react on file changes and store to Cloud Database
 */
export async function getGCSAndStoreToDataBase(
  data: BucketEventData,
  /* ,context: PubSubContext */
) {
    const start: any = new Date();
    const { name } = data;
    if (!name.endsWith(".cif")) {
        return Promise.resolve();
    }
    const fileRegex = /^[\w\d.\/]+\/(\d+)\.cif$/i;
    const matches = fileRegex.exec(name);
    if (!matches || !matches[1]) {
        return Promise.reject("Wrong File Format");
    }
    const codId = matches[1];

    const tempLocalPath = `/tmp/${path.parse(name).base}`;

    try {
      await bucket.file(name).download({ destination: tempLocalPath });

      const fileContent = (await readFile(tempLocalPath)).toString();

      const jcif = parse(fileContent);

      const dataNames = Object.keys(jcif);

      if (dataNames.length !== 1) {
          // tslint:disable-next-line
          console.error("error while parsing processing file", name);
          throw new Error("wrong data format");
      }
      const dataToSave: any = cleanupJCif(jcif[dataNames[0]]);

      const documentRef = firestore.doc(`structures/${codId}`);

      await documentRef.set({
          ...dataToSave,
      });

      const end = ((new Date() as any) - start);
      // tslint:disable-next-line
      console.info(`file: ${ Math.round(fileContent.length / 1024) } KB; jcif length : ${Math.round( JSON.stringify(dataToSave).length / 1024 )} KB, time: ${Math.round(end)} ms`);

    } finally {
        await unlink(tempLocalPath);
    }
}
