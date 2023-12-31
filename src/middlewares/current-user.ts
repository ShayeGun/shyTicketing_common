import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            currentUser?: any;
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.jwt) return next();

    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_SECRET!);
        req.currentUser = payload;
        // res.status(200).send({ currentUser: payload });

    } catch (err) { }

    next()
}