import type { Request, Response, NextFunction } from "express";
import { HttpException } from "./httpException.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/index.js";
import { UserModel } from "../models/user.model.js";
import type { RequestWithUser, User } from "../interfaces/user.interface.js";

const getAuthrization = (req: Request) => {
    const authorization = req.cookies['Authorization'];
    return authorization;
 }

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const authorization = await getAuthrization(req);
        
        if (!authorization) return next(new HttpException(401, 'Authentication Not Found'));

        const { _id, tokenVersion } = jwt.verify(authorization, JWT_SECRET as string) as { _id: string, tokenVersion: number };
        const user: User| null = await UserModel.findById(_id);

        if (!user || user.tokenVersion !== tokenVersion) return next(new HttpException(401, 'Token expired. Please login again'));

        req.user = user;
        next();
    } catch (error) {
        next(new HttpException(401, 'Authentication failed'));
    }
}