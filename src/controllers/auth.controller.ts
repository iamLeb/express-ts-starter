import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import type { RequestWithUser, User } from "../interfaces/user.interface.js";
import { APP_ENV } from "../configs/index.js";
import { MailService } from "../services/mail.service.js";

export class AuthController {
    private readonly authService = new AuthService();
    private readonly mailService = new MailService();

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

    /** 
     * Forgot Password Route Handler
     */
    public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const { user, resetToken } = await this.authService.generatePasswordResetToken(email);
            // send password reset email
            await this.mailService.sendMail(user.email, 'Password Reset', `Hello ${user.name}, Your password reset token is: ${resetToken}. It is valid for 15 minutes.`);
            res.status(200).json({ message: 'Password reset email sent if the email is registered' });
        } catch (error) {
            next(error);
        }
    }

    /** 
     * Reset Password Route Handler
     */
    public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, newPassword } = req.body;
            const user = await this.authService.resetPassword(token, newPassword);
            // send confirmation email
            await this.mailService.sendMail(user.email, 'Password Reset Successful', `Hello ${user.name}, Your password has been reset successfully.`);
            res.status(200).json({ message: 'Password has been reset successfully' });
        } catch (error) {
            next(error);
        }
    }

}