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

export const processMessage = async ({ fileName, codId, context }: { fileName: string, codId: string; context: AppContext}) => {
    try {
        let collection = context.db.collection("structures");
        let fileContent = await readFile(fileName);
        let jcif: any = parse(fileContent.toString());

        const dataNames = Object.keys(jcif);

        if (dataNames.length === 0) {
            // tslint:disable-next-line
            console.error("error while parsing processing file", fileName);
            throw new Error("wrong data format");
        }

        let dataToSave = cleanupJCif(jcif[dataNames[0]]);
        const now = (new Date());

        await collection.findOneAndUpdate({
            _id: codId,
        }, {
            '$set':  {
                _id: codId,
                ...dataToSave,
                'updated': now,
            },
            '$min' : {
                'created': now
            }
        }, {
            upsert: true,
            returnOriginal: false,
        });

        collection = null;
        fileContent = null;
        jcif = null;
        dataToSave = null;

    } catch(e) {
        // tslint:disable-next-line
        console.error(e);
    }
}

