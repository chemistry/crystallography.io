import { Dexie } from 'dexie';

let dbStatus: Promise<any> = null;
let db: AppDatabaseStorage = null;
export class AppDatabaseStorage extends Dexie {
    structures: Dexie.Table<Structure, number>;
    catalogId: Dexie.Table<Catalog, number>;
    collectionData: Dexie.Table<CollectionData, string>;

    constructor() {
      super("data");

      this.version(3).stores({
        collectionData: "++id",
        catalogId: "++id,expire",
        structures: "++id,expire"
      });

      this.structures = this.table("structures");
      this.collectionData = this.table("collectionData");
      this.catalogId = this.table("catalogId");
    }
}

interface CollectionData {
    id: string;
    meta: any;
}
interface Catalog {
    id: number;
    type: string;
    attributes: {
        id: number;
        structures: number[];
    }
}
interface Structure {
    id: string;
    name: string;
}

export const getDB = async ()=> {
    if (dbStatus) {
        await dbStatus;
        return db;
    }
    db = new AppDatabaseStorage();

    dbStatus = db.open();
    await dbStatus;
    return db;
}

export const isNode = (!process.env.BROWSER);
