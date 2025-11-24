import type { Request, Response, NextFunction } from "express";
import type { HttpException } from "./httpException.js";
import { Logger } from "../utils/logger.js";

export class ErrorMiddleware {
    static handleError(err: HttpException, req: Request, res: Response, next: NextFunction) {
        // Append the Logger file with the error details
        const status = err.status;
        const message = err.message;
        res.status(status).json({ status, message, method: req.method, url: req.url });
        Logger.error(`\n Status: ${status} \n Message: ${message} \n Method: ${req.method} \n URL: ${req.url} \n _____________________________\n`);
    }
}