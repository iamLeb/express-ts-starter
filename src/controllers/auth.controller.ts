import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import type { RequestWithUser, User } from "../interfaces/user.interface.js";
import { APP_ENV } from "../configs/index.js";

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

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.body;
            const { user, token } = await this.authService.loginUser(userData);
            // Set cookie in response header
            res.cookie('Authorization', token.token, { 
                httpOnly: true, 
                maxAge: token.expiresIn * 1000, 
                secure: APP_ENV === 'production', 
                sameSite: 'lax' 
            });
            res.status(200).json({ data: { user, token }, message: 'User logged in successfully' });
        } catch (error) {
            next(error);
        }
    }

    public check = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const user: User = req.user as User;
            res.status(200).json({ data: user, message: 'Authentication valid' });
        } catch (error) {
            next(error);
        }
    }

    public logout = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const user: User = req.user as User;
            await this.authService.logoutUser(user);
            
            res.clearCookie('Authorization');
            res.status(200).json({ data: user, message: 'User logged out successfully' });
        } catch (error) {
            next(error);
        }
    }
}