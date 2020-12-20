import { Db, MongoClient } from "mongodb";
import { AppContext } from "./app";

const CATALOG_PAGE_SIZE = 100;
const SITEMAP_PAGE_SIZE = 1000;

export const processMessage = async ({ context }: { context: AppContext}) => {
    try {
        const { logger, db } = context;

        const ids: number[] = await db.collection("structures").find({}, {
            sort: "_id",
            _id: 1,
        } as any).map(({_id}: {_id: number}) => _id).toArray();


        const structureCatalogDocs = [];
        for (let i = 0; i < Math.ceil(ids.length / CATALOG_PAGE_SIZE); i++) {
            const structures = ids.slice(i * CATALOG_PAGE_SIZE, (i + 1) * CATALOG_PAGE_SIZE);
            structureCatalogDocs.push({
                _id: (i + 1),
                order: 'id',
                structures,
            });
        }
        await db.collection("catalogs").remove({});
        await db.collection("catalogs").insertMany(structureCatalogDocs);


        // save sitemap catalog
        const sitemapDocs = [];
        for (let i = 0; i < Math.ceil(ids.length / SITEMAP_PAGE_SIZE); i++) {
            const structures = ids.slice(i * SITEMAP_PAGE_SIZE, (i + 1) * SITEMAP_PAGE_SIZE);
            sitemapDocs.push({
                _id: (i + 1),
                structures,
            });
        }

        await db.collection("sitemaps").remove({});
        await db.collection("sitemaps").insertMany(sitemapDocs);

        logger.info({ text: 'processing message .... ' });

    } catch(e) {
        // tslint:disable-next-line
        console.error(e);
    }
}

