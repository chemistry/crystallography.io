// tslint:disable:no-console
import { Firestore, FieldValue } from "@google-cloud/firestore";
// tslint:disable:no-var-requires
const isEqual = require('lodash.isequal');

import { extractAuthorDetails, extractAuthorsList } from "./authorHelper";
const firestore = new Firestore();

interface Document {
    name: string;
    fields: {
        [key: string]: any;
    };
    createTime: string;
    updateTime: string;
}
interface DocumentMask {
    "fieldPaths": string[]
}

interface FirestoreChangeEvent {
    oldValue: Document,
    updateMask: DocumentMask,
    value: Document
}
// Store information about document authors
export async function handler(
    event: FirestoreChangeEvent,
) {
    console.time("process");
    console.log(JSON.stringify(event));
    const { value: { name }} = event;
    const documentPath = name.split('/documents/')[1];
    const document = firestore.doc(documentPath);

    const documentSnapshot  = await document.get();
    const data = unmapLoops(documentSnapshot.data());
    const authorsList = extractAuthorsList(data) || [];

    const authorsToSave = authorsList.map((item) => {
        const recognizedRecord = extractAuthorDetails(item);
        if (!recognizedRecord) {
            console.log('Unprocessed author found: "' + item + '"', "docid:" + documentSnapshot.id);
            return null;
        }
        return {
            docId: documentSnapshot.id,
            name: item,
            recognizedRecord,
        };
    }).filter(((item) => !!item));

    for (const authorRecord of authorsToSave) {
        await saveAuthorRecord(authorRecord);
    }

    await saveAuthorsToDoc(document, data, authorsToSave);

    console.log(`document changed: ${JSON.stringify(data)}`);
    console.log(`Authors to save: ${JSON.stringify(authorsToSave)}`);
    console.timeEnd("process");
}
const saveAuthorRecord  = async (recordData: {
    docId: string;
    name: string;
    recognizedRecord: {
        family: string;
        first: string;
        second: string;
    };
}) => {
    const record = recordData.recognizedRecord;
    const family = ucfirst(record.family || "");
    const full = getAuthorFullByDetails(record);

    const row = {
        a: family.substring(0, 1).toUpperCase(),
        ab: family.substring(0, 2).toUpperCase(),
        abc: family.substring(0, 3).toUpperCase(),
        family,
        first: (record.first || "").charAt(0).toUpperCase(),
        second: (record.second || "").charAt(0).toUpperCase(),
        full,
    };

    const document = firestore.doc(`authors/${row.full}`);

    await document.set({
        ...row,
        structures: FieldValue.arrayUnion(recordData.docId),
    }, {
        merge: true
    });

    const doc = await document.get();
    const count = doc.data().structures.length;
    await document.set({
        count,
        timestamp: Date.now()
    }, {
        merge: true
    });
}

const saveAuthorsToDoc = (
    document: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>,
    data: FirebaseFirestore.DocumentData,
    authorRecordsData: {
        docId: string;
        name: string;
        recognizedRecord: {
            family: string;
            first: string;
            second: string;
        };
    }[]
) => {
    const authorsInfo = authorRecordsData.map((item) => {
        return {
            name: item.name,
            link: getAuthorFullByDetails(item.recognizedRecord),
        };
    });
    const { __authors } =  data;

    if (!isEqual(__authors, authorsInfo)) {
        document.set({
            __authors: authorsInfo
        }, { merge: true });
    }
}

const unmapLoops = (doc: FirebaseFirestore.DocumentData) => {
    if (!doc.loops) {
        return doc;
    }
    const loops = doc.loops.map(({ columns, data}: {columns: string, data: string})=> {
        return {
            columns: JSON.parse(columns),
            data: JSON.parse(data)
        }
    });

    return {
        ...doc,
        loops
    }
}

const getAuthorFullByDetails = (autorDB: {
    family: string;
    first: string;
    second: string;
}): string => {
    if (!autorDB) {
        return "";
    }
    const family = ucfirst(autorDB.family || "");
    let full = "";

    if (autorDB.first && autorDB.second) {
        full = family + " " + (autorDB.first).charAt(0).toUpperCase() + ". " + (autorDB.second).charAt(0).toUpperCase() + ".";
    }
    if (autorDB.first && !autorDB.second) {
        full = family + " " + (autorDB.first).charAt(0).toUpperCase() + ".";
    }
    if (!autorDB.first && !autorDB.second) {
        full = family;
    }

    return full;
}

const ucfirst = (str: string): string => {
    if (!str) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.substr(1, str.length - 1);
}
