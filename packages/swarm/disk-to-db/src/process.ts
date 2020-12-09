import { parse } from "@chemistry/cif-2-json";
import { Db, MongoClient } from "mongodb";
import * as fs from "fs";
import * as util from "util";
import { cleanupJCif } from "./helpers";
import { AppContext } from "./app";

export interface CodFileRecord {
    fileName: string;
    codId: string;
}

const readFile = util.promisify(fs.readFile);

export const processMessage = ({ db }: AppContext) => async ({ fileName, codId }: CodFileRecord) => {

/*
    const collection = db.collection("structures");

    // tslint:disable-next-line
    console.log({ fileName, codId });

    await new Promise(res => setTimeout(res, 1000));

    let fileContent = await readFile(fileName);
    let jcif: any = parse(fileContent.toString());

    const dataNames = Object.keys(jcif);

    if (dataNames.length === 0) {
        console.error("error while parsing processing file", fileName);
        throw new Error("wrong data format");
    }
    let dataToSave = cleanupJCif(jcif[dataNames[0]]);

    await collection.findOneAndUpdate({
        _id: codId,
    }, {
        _id: codId,
        ...dataToSave,
    }, {
        upsert: true,
        returnOriginal: false,
    });
    console.log('success');
*/
}

