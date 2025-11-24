import { config } from 'dotenv';
config();

export const { APP_NAME, APP_ENV, PORT, DB_STRING, JWT_SECRET } = process.env;