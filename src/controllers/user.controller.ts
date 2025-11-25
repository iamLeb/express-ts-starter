import type { Request, Response, NextFunction } from "express";
import type { RequestWithUser, User } from "../interfaces/user.interface.js";
import { UserService } from "../services/user.service.js";
import { UserModel } from "../models/user.model.js";
import { HttpException } from "../middlewares/httpException.js";

export class UserController {
    private readonly userService = new UserService();

    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Logic to get all users
            const users = await this.userService.getAllUsers();

            res.json({ data: users, message: "Get all users" });
        } catch (error) {
            next(error);
        }
    }

    public getUserById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id as string;
            const user: User | null = await this.userService.getUserById(userId);

            if (!user) throw new HttpException(404, "User not found");

            res.json({ data: user, message: "Get user by ID" });
        } catch (error) {
            next(error);
        }
    }

    public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id as string;
            const userData: User = req.body;

            const updatedUser: User | null = await this.userService.updateUser(userId, userData);

            if (!updatedUser) throw new HttpException(404, "User not found");

            res.json({ data: updatedUser, message: "User updated successfully" });
        } catch (error) {
            next(error);
        }
    }

    public deleteUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id as string;
            const deletedUser: User | null = await this.userService.deleteUser(userId);

            if (!deletedUser) throw new HttpException(404, "User not found");
            res.json({ data: deletedUser, message: "User deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}