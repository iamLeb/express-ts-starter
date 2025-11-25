import express from 'express';
import { PORT } from './configs/index.js';
import type { Route } from './interfaces/route.interface.js';
import { DatabaseConfig } from './configs/db.config.js';
import { ErrorMiddleware } from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';

export class App {
    public app: express.Application
    
    constructor(routes: Route[]) {
        this.app = express();
        this.initializeDatabaseConnection();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }
    private initializeDatabaseConnection() {
        // Database connection logic here
        new DatabaseConfig();
    }

    private initializeMiddlewares() {
        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private initializeRoutes(routes: Route[]) {
        routes.forEach( route => this.app.use('/', route.router));
    }

    private initializeErrorHandling() {
        this.app.use(ErrorMiddleware.handleError);
    }

    public listen = () => {
        this.app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    }
}