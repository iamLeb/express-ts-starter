import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import type { User } from "../interfaces/user.interface.js";

export class AuthController {
    private readonly authService = new AuthService();

    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.body;
            const user: User = await this.authService.createUser(userData);

            res.status(201).json({ data: user, message: 'User registered successfully' });
        } catch (error) {
            next(error);
        }
    }

    public login = (req: Request, res: Response, next: NextFunction) => {
        const userData: User = req.body;
    }
}