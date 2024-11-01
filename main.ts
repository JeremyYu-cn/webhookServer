import Koa from "koa";
import cors from "@koa/cors";
import router from "./src/router";
import Config from "./config";
import { errorHandle } from "./src/middleware";

const app = new Koa();

// Global error handler
app.use(errorHandle);

// CORS
app.use(cors());

// RESTFul Router
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(Config.port, () => {
  console.log(`
    Web hook server running at ${Config.port}
    Environment: ${process.env.NODE_ENV}
  `);
});
