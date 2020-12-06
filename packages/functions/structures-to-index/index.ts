import { Firestore, FieldValue } from "@google-cloud/firestore";
import { Client } from 'elasticsearch';

// tslint:disable:no-console
const firestore = new Firestore();


// instantiate an Elasticsearch client
const ES_KEY = process.env.ES_KEY || '';
const client = new Client({
    host: 'http://search.crystallography.io',
    httpAuth: ES_KEY,
    apiVersion: '7.2',
});

client.ping({
    requestTimeout: 30000,
});

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

export async function handler(
    event: FirestoreChangeEvent,
) {
    const { value } = event;
    if (Object.keys(value).length === 0 && value.constructor === Object) {
        // Delete operation
        return;
    }
    const { name } = value;
    if (!name){
        throw new Error(`unknown event format: ${JSON.stringify(event)}`);
    }

    const documentPath = name.split('/documents/')[1];
    const document = firestore.doc(documentPath);

    const documentSnapshot  = await document.get();
    const data = documentSnapshot.data();

    const dateStr = (new Date()).toISOString();

    const bodyToStore = {
        id: documentSnapshot.id,
        mineral: data.mineral || "",
        commonname: data.commonname || "",
        chemname: data.chemname || "",
        title: data.title || "",
        mineral_suggest: data.mineral || "",
        commonname_suggest: data.commonname || "",
        chemname_suggest: data.chemname || "",
        title_suggest: data.title || "",
        commonname_autocomplete: data.commonname || "",
        chemname_autocomplete: data.chemname || "",
        title_autocomplete: data.title || "",
        created: dateStr,
        modified: dateStr
    };

    client.index({
        id: documentSnapshot.id,
        index: 'structures.data',
        type: '_doc',
        body: {
            ...bodyToStore,
        }
    }, (err: any, resp: any) =>{
        console.error(err);
    });
}
