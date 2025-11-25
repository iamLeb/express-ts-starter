import bcrypt from "bcryptjs";
import { model, Schema } from "mongoose";
import type { User } from "../interfaces/user.interface.js";

const userSchema = new Schema({
    name: {
        type: 'string',
        required: true,
    },
    phone: {
        type: 'string',
        required: false,
        unique: true,
    },
    email: {
        type: 'string',
        required: true,
        unique: true,
    },
    password: {
        type: 'string',
        required: true,
    },
    tokenVersion: {
        type: Number,
        default: 0
    },
    passwordResetToken: {
        type: String,
        required: false,
    },
    passwordResetExpires: {
        type: Date,
        required: false,
    }

});

userSchema.pre('save', async function () {
    // Hash password before saving
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
});

export const UserModel = model<User & Document>('User', userSchema);
