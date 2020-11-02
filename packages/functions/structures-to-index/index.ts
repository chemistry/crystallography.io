import { Firestore, FieldValue } from "@google-cloud/firestore";
import { Client } from 'elasticsearch';

// tslint:disable:no-var-requires
// tslint:disable:no-console
const isEqual = require('lodash.isequal');

const firestore = new Firestore();
const elasticsearch = require('elasticsearch');

// instantiate an Elasticsearch client
const client = new elasticsearch.Client({
    hosts: [ 'http://elasticsearch.crystallography.io']
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
    console.time("process");
    console.log(JSON.stringify(event));
    const { value: { name }} = event;
    const documentPath = name.split('/documents/')[1];
    const document = firestore.doc(documentPath);

    const documentSnapshot  = await document.get();
    const data = documentSnapshot.data();

    const bodyToStore = {
        id: documentSnapshot.id,
        mineral: data.mineral || "",
        commonname: data.commonname || "",
        chemname: data.chemname || "",
        title: data.title || ""
    };

    client.index({
        id: documentSnapshot.id,
        index: 'structures.documents',
        type: 'doc',
        body: {
            ...bodyToStore,
        }
    }, (err: any, resp: any, status: any) =>{
        console.log(err);
        console.log(resp);
        console.log(status);
    });


    console.timeEnd("process");
}
