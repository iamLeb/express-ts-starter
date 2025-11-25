import express from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';

export class UserRoute {
    public path = '/users';
    public router = express.Router();
    public readonly userController = new UserController();
    
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.get(this.path, authMiddleware, this.userController.getAllUsers);
        this.router.get(`${this.path}/:id`, authMiddleware, this.userController.getUserById);
        this.router.put(`${this.path}/:id`, authMiddleware, this.userController.updateUser);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.userController.deleteUser);
    }
}