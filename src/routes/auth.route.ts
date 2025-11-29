import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { LoginLimiter } from '../utils/loginLimiter.js';
import { ValidationMiddleware } from '../middlewares/validate.middleware.js';
import { CreateUserDto } from '../dtos/user.dto.js';

export class AuthRoute {
    public path = '/auth';
    public router = express.Router();
    private readonly authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, LoginLimiter, this.authController.login);
        this.router.post(`${this.path}/register`, ValidationMiddleware(CreateUserDto), this.authController.register);
        this.router.get(`${this.path}/check`, authMiddleware, this.authController.check);
        this.router.post(`${this.path}/logout`, authMiddleware, this.authController.logout);

        // Password reset and email verification routes can be added here in the future
        this.router.post(`${this.path}/forgot-password`, LoginLimiter, this.authController.forgotPassword);
        this.router.post(`${this.path}/reset-password`, this.authController.resetPassword);
    }
}