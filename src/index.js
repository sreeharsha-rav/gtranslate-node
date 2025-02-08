const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const { getConfig } = require("./config/cloudConfig");
const logger = require("./services/logger");
const translateRouter = require("./routes/translate");
const textToSpeechRouter = require("./routes/textToSpeech");
const healthRouter = require("./routes/health");
// Initialize configuration
const config = getConfig();
const app = new Koa();

// CORS configuration
const corsOptions = {
  origin: (ctx) => {
    const origin = ctx.get("Origin");
    return config.cors.origins.includes(origin)
      ? origin
      : config.cors.origins[0];
  },
  credentials: true,
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "Accept"],
  exposeHeaders: ["Content-Length", "Date", "X-Request-Id"],
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser());

// Add logging middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  try {
    await next();
    const ms = Date.now() - start;
    logger.info({
      method: ctx.method,
      url: ctx.url,
      status: ctx.status,
      duration: `${ms}ms`,
    });
  } catch (err) {
    const ms = Date.now() - start;
    logger.error({
      method: ctx.method,
      url: ctx.url,
      status: ctx.status,
      error: err.message,
      duration: `${ms}ms`,
    });
    throw err;
  }
});

// Routes
app.use(healthRouter.routes());
app.use(healthRouter.allowedMethods());
app.use(translateRouter.routes());
app.use(translateRouter.allowedMethods());
app.use(textToSpeechRouter.routes());
app.use(textToSpeechRouter.allowedMethods());

// Error handling
app.on("error", (err, ctx) => {
  logger.error({
    err,
    context: {
      url: ctx.request.url,
      method: ctx.request.method,
      body: ctx.request.body,
    },
  });
  ctx.status = err.status || 500;
  ctx.body = { error: "Internal server error" };
});

const port = config.server.port;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Add SIGTERM handler
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");

  // Close any database connections
  // mongoose.connection.close();

  // Close any other resources
  // redis.quit();

  process.exit(0);
});
