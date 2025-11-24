import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';

export class AuthRoute {
    public path = '/auth';
    public router = express.Router();
    private readonly authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, this.authController.login);
        this.router.post(`${this.path}/register`, this.authController.register);
    }
}