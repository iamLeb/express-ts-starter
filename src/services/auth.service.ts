import bcrypt from "bcryptjs";
import type { TokenData, User } from "../interfaces/user.interface.js"
import { HttpException } from "../middlewares/httpException.js";
import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { APP_ENV, JWT_SECRET } from "../configs/index.js";
import crypto from "crypto";

const createToken = (user: User): TokenData => {
    const expiresIn = 30 * 24 * 60 * 60; // 30 days in seconds
    const token: TokenData = { expiresIn, token: jwt.sign({ _id: user._id, tokenVersion: user.tokenVersion }, JWT_SECRET as string, { expiresIn: '30d' }) };
    return token;
}

export class AuthService {
    public createUser = async (userData: User): Promise<User> => {
        // Logic to create a user
        try {
            const user: User = await UserModel.create(userData);
            return user;
        } catch (error) {
            throw new HttpException(500, `${error}`);
        }
    }

    public loginUser = async (userData: User): Promise<{ user: User, token: TokenData }> => {
        // Logic to authenticate a user
        const { email, password } = userData;
        try {
            // check if user exists
            const existUser = await UserModel.findOne({ email });
            if (!existUser) throw new HttpException(404, 'User does not exist');

            // validate password
            const isPasswordValid = await bcrypt.compare(password, existUser.password);
            if (!isPasswordValid) throw new HttpException(401, 'Invalid password');

            // create token 
            const token = createToken(existUser);
            // const cookie = createCookie(token);

            return { user: existUser, token };
        } catch (error) {
            throw new HttpException(500, `${error}`);
        }
    }

    public logoutUser = async (user: User) => {
        // Logic to logout a user
        await UserModel.findByIdAndUpdate(user._id, { $inc: { tokenVersion: 1 } });
    }

    /** 
     * Forgot Password Service
     */
    public generatePasswordResetToken = async (email: string): Promise<{ user: User, resetToken: string }> => {
        const user: User | null = await UserModel.findOne({ email });
        if (!user) throw new HttpException(404, "User does not exist");

        const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit token

        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        const updatedUser: User | null = await UserModel.findByIdAndUpdate(
            user._id,
            { passwordResetToken: hashedToken, passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000) },
            { new: true }
        );
        if (!updatedUser) throw new HttpException(500, "Failed to update user");

        return { user: updatedUser, resetToken }; // send full token for email
    };


    /** 
     * Reset Password Service
     */
    public resetPassword = async (token: number, newPassword: string): Promise<User> => {
        try {
            // hash the received token
            const hashedToken = crypto.createHash("sha256").update(token.toString()).digest("hex");

            // find user by token and check if token is not expired
            const user: User | null = await UserModel.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: new Date() } // token expiration is in the future
            });
            if (!user) throw new HttpException(400, 'Invalid or expired password reset token');

            // hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // update user's password and clear reset token fields
            const updatedUser = await UserModel.findByIdAndUpdate(user._id, {
                password: hashedPassword,
                passwordResetToken: "",
                passwordResetExpires: null
            }, { new: true }) as User;

            console.log('Password reset successful for user:', updatedUser);
            return updatedUser;

        } catch (error) {
            throw new HttpException(500, `${error}`);
        }
    }
}