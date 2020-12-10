import { parse } from "@chemistry/cif-2-json";
import { Db, MongoClient } from "mongodb";
import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import { cleanupJCif } from "./helpers";
import { AppContext } from "./app";

export interface CodFileRecord {
    fileName: string;
    codId: string;
}

const readFile = util.promisify(fs.readFile);

export const processMessage = ({ db, exec }: AppContext) => async ({ fileName, codId }: CodFileRecord) => {

    try {
        const collection = db.collection("structures");
        const fileContent = await readFile(fileName);
        const jcif: any = parse(fileContent.toString());

        await new Promise(res => setTimeout(res, 1000));

        const dataNames = Object.keys(jcif);

        if (dataNames.length === 0) {
            // tslint:disable-next-line
            console.error("error while parsing processing file", fileName);
            throw new Error("wrong data format");
        }

        const dataToSave = cleanupJCif(jcif[dataNames[0]]);

        await collection.findOneAndUpdate({
            _id: codId,
        }, { '$set':  {
            _id: codId,
            ...dataToSave,
        } }, {
            upsert: true,
            returnOriginal: false,
        });

    } catch(e) {
        // tslint:disable-next-line
        console.error(e);
    }
}

