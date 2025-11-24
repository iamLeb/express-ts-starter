import mongoose from "mongoose";
import { DB_STRING } from "./index.js";

export class DatabaseConfig {
    constructor() {
        this.connect();
    }

    private connect() {
        // Connection logic here
        mongoose.connect(DB_STRING as string).then(() => {
            console.log('Database connected successfully');
        }).catch((error) => {
            console.error('Database connection error:', error);
        });
    }
}