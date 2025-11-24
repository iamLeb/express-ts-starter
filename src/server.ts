import { App } from "./app.js";
import { AuthRoute } from "./routes/auth.route.js";

const app = new App([
    // import routes here
    new AuthRoute(),
]);

app.listen();