import { App } from "./app.js";
import { AuthRoute } from "./routes/auth.route.js";
import { UserRoute } from "./routes/user.route.js";

const app = new App([
    // import routes here
    new AuthRoute(),
    new UserRoute(),
]);

app.listen();