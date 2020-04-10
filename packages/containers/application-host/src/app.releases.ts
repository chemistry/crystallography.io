import { Firestore } from "@google-cloud/firestore";
const firestore = new Firestore();

export interface ReleaseInfo {
    id: string;
    resources: {
        css: string;
        js: string;
    };
    name: string;
    date: string;
    version: string;
    path: string;
}

export const getReleases = async (): Promise<ReleaseInfo[]> => {
  return await firestore
    .collection("releases")
    .limit(100)
    .get()
    .then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => doc.data() as ReleaseInfo);
    });
};
