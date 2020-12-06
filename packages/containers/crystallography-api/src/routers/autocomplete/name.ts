import { Client } from 'elasticsearch';
import { Firestore } from '@google-cloud/firestore';
import Joi from "joi";
import { Router, Request, Response } from "express";

export const getNameAutocompleteRouter = ({ firestore, elasticSearch }: { firestore: Firestore, elasticSearch: Client }) => {
    const router = Router();

    router.get("/", (req: Request, res: Response) => {

        let name = String(req.query.name || "");
        name = name.replace(/[^\-()'a-z/\\,.\][α-ωΑ-Ω0-9]/gmi, " ").replace(/\s+/g, " ").trim();

        const validationRes = Joi.object().keys({
            name: Joi.string().min(1).max(255).required(),
        }).validate({
            name
        });

        if (validationRes.error) {
            return res.status(400).json({
                status: 400,
                title: "Incorrect name for autocomplete",
                detail: "Incorrect name for autocomplete",
            });
        }


/* ---- This query works quite well
"suggest": {
    "title-suggest": {
      "prefix":  name,
      "completion": {
        "field": "title_suggest",
        "fuzzy": {
            "fuzziness": 2
        },
        "size": 10
      }
    }
}
*/

/*
"query": {
    "multi_match": {
        "query": name,
        "type": "bool_prefix",
        "fields": [
            "title",
            "title._2gram",
            "title._3gram"
        ]
    }
}
*/
// "Pristinamycin complex solved using Shake-and-Bake",
        elasticSearch.search({
            index: 'structures',
            body: {
                "suggest": {
                    "commonname-suggest": {
                      "prefix":  name,
                      "completion": {
                        "field": "commonname_suggest",
                        "fuzzy": {
                            "fuzziness": 2
                        },
                        "size": 10
                      }
                    }
                }
            }
        })
        .then((data: any)=> {
            const { took, time_out, hits } = data;
            return res.status(200).json({
                data
            });
        })
        .catch((e: any) => {
            // tslint:disable-next-line
            console.error(e.stack);
            return res.status(500).json({
                status: 500,
                title: "Something wrong with connection to elastic search",
                detail: "Something wrong with connection to elastic search",
            });
        });
    });

    return router;
};
