import { Firestore } from '@google-cloud/firestore';
import Joi from "joi";
import { Router, Request, Response } from "express";

export const getAuthorSearchRouter = ({ firestore }: { firestore: Firestore }) => {
    const router = Router();

    router.post("/", (req: Request, res: Response) => {

        if (!req.body) {
            return res.status(500).json({
                status: 500,
                title: "Invalid Body Params",
                detail: "Invalid Body Params",
            });
        }


        let page: number = parseInt(req.body.page as string, 10);
        page = page && isFinite(page) ? page : 1;

        let name = req.body.name || "";
        const nameChars = "\\w\\u00C0-\\u021B\\-\\`'’ιλḰṕḾŃḱóOů̅ουḿα\u2019";
        name = name.replace(new RegExp("[^" + nameChars + "\\.\\-\\s]"), "").replace(/\s+/g, " ").trim();

        const pageNameValidation = Joi.object().keys({
            name: Joi.string().min(3).max(255).required(),
            page: Joi.number().integer().min(1).max(99999).required(),
        });

        const validationRes = pageNameValidation.validate({
            name, page,
        });

        if (validationRes.error) {
            return res.status(400).json({
                status: 400,
                title: "Incorrect author or page",
                detail: "Incorrect author or page",
            });
        }

        getSearchWhere({
            name,
            collection: firestore.collection("authors")
        })
        .orderBy("count", "desc")
        .get()
        .then((querySnapshot: any) => {

            const data = querySnapshot.docs.map((doc: any) => {
                const { id, full, count, structures } = doc.data();
                return {
                    id: doc.id,
                    attributes: {
                        full,
                        count,
                        structures
                    }
                };
            });

            return res.status(200).json({
                errors: [],
                meta: {},
                data,
            });
        })
        .catch((e) => {
            // tslint:disable-next-line
            console.error(e.stack);

            return res.status(500).json({
                errors: [String(e)],
                meta: {},
            });
        });
    });

    return router;
};

const getSearchWhere = ({
    name,
    collection
}: {
    name: string,
    collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
}) => {
    if (name.length === 1) {
        return collection
            .where('a', "==", name.toUpperCase());
    }

    if (name.length === 2) {
        return collection
            .where('ab', "==", name.toUpperCase());
    }

    if (name.length === 3) {
        return collection
            .where('abc', "==", name.toUpperCase());
    }

    return collection
        .where('full', "==", name);
}
