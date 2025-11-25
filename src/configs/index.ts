import { config } from 'dotenv';
config();

export const { APP_NAME, APP_ENV, PORT, DB_STRING, JWT_SECRET, ORIGIN } = process.env;
export const { SENDGRID_API_KEY, SENDGRID_FROM, CLIENT_URL } = process.env;