import type { User } from "../interfaces/user.interface.js"
import { HttpException } from "../middlewares/httpException.js";
import { UserModel } from "../models/user.model.js";

export class AuthService {
    public createUser = async (userData: User): Promise<User> => {
        // Logic to create a user
        try {
            const user: User = await UserModel.create(userData);
            return user;
        } catch (error) {
            throw new HttpException(500, 'Unable to create user');
        }
    }

    public loginUser = async (userData: User) => {
        // Logic to authenticate a user
    }
}