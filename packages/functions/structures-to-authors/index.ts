// tslint:disable:no-console
import { Firestore } from "@google-cloud/firestore";
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
    const doc  = await firestore.doc(documentPath).get();


    console.log(`document changed: ${JSON.stringify(doc)}`)
    console.timeEnd("process");
}

