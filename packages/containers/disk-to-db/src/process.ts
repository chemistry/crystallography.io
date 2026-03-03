import { parse } from "@chemistry/cif-2-json";
import * as Sentry from "@sentry/node";
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
            console.error("error while parsing processing file", fileName);
            throw new Error("wrong data format");
        }

        let dataToSave = cleanupJCif(jcif[dataNames[0]]);
        const now = (new Date());

        await collection.findOneAndUpdate({
            _id: Number(codId) as any,
        }, {
            '$set':  {
                _id: Number(codId),
                ...dataToSave,
                'updated': now,
            },
            '$min' : {
                'created': now
            }
        }, {
            upsert: true,
            returnDocument: 'after',
        } as any);

        collection = null as any;
        fileContent = null as any;
        jcif = null;
        dataToSave = null as any;

    } catch(e) {
        Sentry.captureException(e);
        console.error(e);
    }
}

