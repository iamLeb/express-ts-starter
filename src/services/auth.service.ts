import bcrypt from "bcryptjs";
import type { TokenData, User } from "../interfaces/user.interface.js"
import { HttpException } from "../middlewares/httpException.js";
import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { APP_ENV, JWT_SECRET } from "../configs/index.js";

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
}