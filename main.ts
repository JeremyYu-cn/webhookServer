import cluster from "node:cluster";
import os from "node:os";
import Koa from "koa";
import cors from "@koa/cors";
import koaBody from "koa-body";
import router from "./src/router";
import config from "./config";
import { errorHandle } from "./src/middleware";
import ServerCache from "./src/utils/cache";
import { releaseReqLock, requestLock } from "./src/middleware/lock";

if (cluster.isPrimary) {
  if (process.env.NODE_ENV === "development") {
    // For dev
    createServer();
  } else {
    const cups = os.availableParallelism();
    for (let i = 0; i < cups; i++) {
      cluster.fork(process.env.NODE_ENV);
    }
    cluster.on("exit", (worker) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  }
} else {
  createServer();
}

function createServer() {
  // Run Server Cache, which is mock redis
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
    ProcessId: ${process.pid}
  `);
  });
}
