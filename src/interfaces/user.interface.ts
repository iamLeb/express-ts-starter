import type { Request } from "express";

export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    tokenVersion: number;
}

export interface TokenData {
    token: string;
    expiresIn: number;
}

export interface RequestWithUser extends Request {
    user?: User;
}

export interface TokenVersion { _id: string, tokenVersion: number }