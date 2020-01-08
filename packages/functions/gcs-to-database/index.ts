import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";

import {
  BucketEventData,
  // ,PubSubContext
} from "@chemistry/common-functions";

const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

const storage = new Storage();
const bucket = storage.bucket("cod-data");
/**
 * Will react on file changes and store to Cloud Database
 */
export async function getGCSAndStoreToDataBase(
  data: BucketEventData,
  /* ,context: PubSubContext */
) {
    const { name } = data;
    const tempLocalPath = `/tmp/${path.parse(name).base}`;

    try {
      await bucket.file(name).download({ destination: tempLocalPath });

      const fileContent = (await readFile(tempLocalPath)).toString();
      // tslint:disable-next-line
      console.log(`Processing file: ${ Math.round(fileContent.length / 1024) } KB`);
    } finally {
        await unlink(tempLocalPath);
    }
}
