// tslint:disable:no-console
import { Firestore } from "@google-cloud/firestore";
const firestore = new Firestore();

// Store information about document authors
export async function handler(
    event: any,
) {
    console.time("process");

    console.log(event);

    const resource = event.value.name;
    const document = resource.split('/documents/')[1];
    console.log(`docuement changed - ${document}`);
    const affectedDoc = firestore.doc(document);

    console.log(affectedDoc)

    console.timeEnd("process");
}

