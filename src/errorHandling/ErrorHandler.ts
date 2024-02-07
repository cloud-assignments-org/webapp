import { ErrorRequestHandler } from "express";
import { BadInputError, BadRequestError, NotFoundError } from "./Errors.js";

// noinspection JSUnusedLocalSymbols
export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    
    if (error instanceof NotFoundError) {
        res.status(404);
    } else if (error instanceof BadInputError) {
        res.status(400);
    } else if (error instanceof BadRequestError) {
        res.status(400);
    }
    // else if (error instanceof AuthError) {
    //     logger.error("Auth error", error);
    //     res.status(error.status).json({ error: error.message });
    // } 
    else {
        console.log(error);
        res.status(500);
    } 
    next();
};
