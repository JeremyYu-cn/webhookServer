import Koa from "koa";
import cors from "@koa/cors";
import koaBody from "koa-body";
import router from "./src/router";
import config from "./config";
import { errorHandle } from "./src/middleware";
import ServerCache from "./src/utils/cache";
import { releaseReqLock, requestLock } from "./src/middleware/lock";

// Run Server Cache
ServerCache.init();

const app = new Koa();

// Global Handle Error Middleware
app.use(errorHandle);

// Handle CORS
app.use(cors());

// Request Lock
app.use(requestLock);

// Handle Request's JSON Parameters
app.use(
  koaBody({
    json: true,
  })
);

// RESTFul Router
app.use(router.routes());
app.use(router.allowedMethods());

// Release Lock
app.use(releaseReqLock);

// Start Listen Port
app.listen(config.port, () => {
  console.log(`
    Web hook server running at ${config.port}
    Environment: ${process.env.NODE_ENV}
  `);
});
