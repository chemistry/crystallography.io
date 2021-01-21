import { Db } from "mongodb";
import { Router, Request, Response } from "express";
import * as Sentry from "@sentry/node";


const HOST = 'https://crystallography.io';
const CATALOGS_PAGES_PER_SITEMAP  = 10;

const getSitemapsList  = ({ db }: { db: Db }) => {

    return async(req: Request, res: Response) => {
        try {
            const sitemapPageCount =  await db.collection("sitemap").countDocuments({});

            res.set('Content-Type', 'text/xml');
            res.write('<?xml version="1.0" encoding="UTF-8"?>');
            res.write('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
            res.write(`<sitemap><loc>${HOST}/sitemap/sitemap_s.xml</loc></sitemap>`);

            // Sitemaps:: with structures
            for (let i = 1; i < sitemapPageCount + 1; i++) {
                res.write(`<sitemap><loc>${HOST}/sitemap/sitemap${i}.xml</loc></sitemap>`);
            }

            res.write("</sitemapindex>");
            res.end();
        } catch (e) {
            // tslint:disable-next-line
            console.error(String(e));
            Sentry.captureException(e);
            res.end();
        }
    }
};

const getStaticSiteMap  = ({ db }: { db: Db }) => {
    return (req: Request, res: Response) => {
        res.set("Content-Type", "text/xml");
        const URLS = ["/", "/search/author",  "/search/name", "/search/formula", "/search/unitcell",  "/authors", "/catalog", "/about", "/contact"];

        res.write('<?xml version="1.0" encoding="UTF-8"?>');
        // tslint:disable-next-line
        res.write('<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">');
        const data = URLS.map((url)=> {
            return `<url><loc>${HOST}${url}</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>`;
        });
        data.forEach((line)=> res.write(line));
        res.write("</urlset>");
        res.status(500).end();
    }
};

const getStructuresList  = ({ db }: { db: Db }) => {
    return async(req: Request, res: Response) => {

        try {
            if (!req.params || !req.params[0] || !isFinite(parseInt(req.params[0], 10)) || parseInt(req.params[0], 10) <= 0) {
                res.status(404);
                res.end("Wrong sitemap");
                return;
            }
            const page = parseInt(req.params[0], 10);
            const doc = await db.collection("sitemap").findOne({ _id: page });
            if (!doc) {
                res.status(404);
                res.end("Wrong sitemap");
                return;
            }

            res.set("Content-Type", "text/xml");
            res.write('<?xml version="1.0" encoding="UTF-8"?>');

            // tslint:disable-next-line
            res.write('<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">');

            (doc.structures || []).forEach((structureId: number)=> {
                res.write(`<url><loc>${HOST}/structure/${structureId}</loc><changefreq>monthly</changefreq><priority>0.2</priority></url>`);
            });

            res.write("</urlset>");
            res.end();
        } catch (e) {
            // tslint:disable-next-line
            console.error(String(e));
            Sentry.captureException(e);
            res.status(500).end();
        }
    }
};


export const getSitemapRouters = ({ db }: { db: Db}) => {
    const router = Router();

    router.get("/sitemap.xml", getSitemapsList({ db }));

    router.get("/sitemap/sitemap_s.xml", getStaticSiteMap({ db }));

    router.get("/sitemap/sitemap([0-9]+).xml", getStructuresList({ db }));

    return router;
};
