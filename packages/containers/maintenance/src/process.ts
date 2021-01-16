import { AppContext } from "./app";

const CATALOG_PAGE_SIZE = 100;
const SITEMAP_PAGE_SIZE = 1000;

export const processMessage = async ({ context }: { context: AppContext}) => {
    try {
        const { db } = context;

        const ids: number[] = await db.collection("structures").find({}, {
            sort: "_id",
            _id: 1,
        } as any).map(({_id}: {_id: number}) => Number(_id)).toArray();

        const structureCatalogDocs = [];
        for (let i = 0; i < Math.ceil(ids.length / CATALOG_PAGE_SIZE); i++) {
            const structures = ids.slice(i * CATALOG_PAGE_SIZE, (i + 1) * CATALOG_PAGE_SIZE);
            structureCatalogDocs.push({
                _id: (i + 1),
                order: 'id',
                structures,
            });
        }
        await db.collection("catalog").remove({});
        await db.collection("catalog").insertMany(structureCatalogDocs);

        // save sitemap catalog
        const sitemapDocs = [];
        for (let i = 0; i < Math.ceil(ids.length / SITEMAP_PAGE_SIZE); i++) {
            const structures = ids.slice(i * SITEMAP_PAGE_SIZE, (i + 1) * SITEMAP_PAGE_SIZE);
            sitemapDocs.push({
                _id: (i + 1),
                structures,
            });
        }

        await db.collection("sitemap").remove({});
        await db.collection("sitemap").insertMany(sitemapDocs);

    } catch(e) {
        // tslint:disable-next-line
        console.error(e);
    }
}

