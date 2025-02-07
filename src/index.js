const { initializeConfig } = require("./config/env");

// Initialize configuration before anything else
const config = initializeConfig();

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const translateRouter = require("./routes/translate");
const textToSpeechRouter = require("./routes/textToSpeech");

const app = new Koa();

// CORS configuration
const corsOptions = {
  origin: (ctx) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : ["http://localhost:3000"];

    const origin = ctx.get("Origin");
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    return allowedOrigins[0];
  },
  credentials: true,
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "Accept"],
  exposeHeaders: ["Content-Length", "Date", "X-Request-Id"],
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser());

// Routes
app.use(translateRouter.routes());
app.use(translateRouter.allowedMethods());
app.use(textToSpeechRouter.routes());
app.use(textToSpeechRouter.allowedMethods());

// Error handling
app.on("error", (err, ctx) => {
  console.error("Server error:", err);
  ctx.status = err.status || 500;
  ctx.body = { error: "Internal server error" };
});

const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${config.server.env} mode`);
});
