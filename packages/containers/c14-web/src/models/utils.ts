import { Dexie } from 'dexie';

let dbStatus: Promise<any> = null;
let db: AppDatabaseStorage = null;
export class AppDatabaseStorage extends Dexie {
    structures: Dexie.Table<Structure, number>;

    constructor() {
      super("data");

      this.version(1).stores({
        collections: "++name,updated,meta",
        structures: "++id,expire"
      });

      this.structures = this.table("structures");
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
