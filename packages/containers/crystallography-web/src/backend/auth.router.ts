import { NextFunction, Request, Response, Router } from "express";
import * as admin from "firebase-admin";

admin.initializeApp();

export const getAuthRouter = () => {
    const router = Router();

    // setting cookies for auth
    router.post("/sessionLogin", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const idToken = req.body.idToken.toString();
        // Set session expiration to 5 days.
        const expiresIn = 60 * 60 * 24 * 5 * 1000;

        const sessionCookie = await admin.auth().createSessionCookie(idToken, {expiresIn});
        const options = { maxAge: expiresIn, httpOnly: true, secure: true, domain: ".crystallography.io" };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));

      } catch (error) {
        next(error);
      }
    });

    router.post("/sessionLogout", (req: Request, res: Response) => {
        res.clearCookie("session");
        res.redirect("/login");
    });

    return router;
};
