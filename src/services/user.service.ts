import type { User } from "../interfaces/user.interface.js";
import { HttpException } from "../middlewares/httpException.js";
import { UserModel } from "../models/user.model.js";

export class UserService {
    public getAllUsers = async (): Promise<User[]> => {
        // Logic to get all users from the database
        try {
            const users: User[] = await UserModel.find();
            return users;
        } catch (error) {
            throw new HttpException(500, `${error}`);
        }
    }

    public getUserById = async (userId: string): Promise<User | null> => {
        try {
            const user: User | null = await UserModel.findById(userId);
            return user;
        } catch (error) {
            throw new HttpException(500, `${error}`);
        }
    }

    public updateUser = async (userId: string, userData: Partial<User>): Promise<User | null> => {
        try {
            const updatedUser: User | null = await UserModel.findByIdAndUpdate(userId, userData, { new: true });
            return updatedUser;
        } catch (error) {
            throw new HttpException(500, `${error}`);
        }
    }

    public deleteUser = async (userId: string): Promise<User | null> => {
        try {
            const deletedUser: User | null = await UserModel.findByIdAndDelete(userId);
            return deletedUser;
        } catch (error) {
            throw new HttpException(500, `${error}`);
        }
    }
}