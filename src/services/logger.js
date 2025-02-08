const isDevelopment = process.env.NODE_ENV === "development";

let logger;

if (isDevelopment) {
  // Development logger with pretty printing
  const pino = require("pino");
  logger = pino({
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
    level: process.env.LOG_LEVEL || "info",
  });
} else {
  // Production logger with basic console
  logger = {
    info: (obj, msg) => {
      if (msg) {
        console.log(JSON.stringify({ level: "info", msg, ...obj }));
      } else {
        console.log(JSON.stringify({ level: "info", msg: obj }));
      }
    },
    error: (obj, msg) => {
      if (msg) {
        console.error(JSON.stringify({ level: "error", msg, ...obj }));
      } else {
        console.error(JSON.stringify({ level: "error", msg: obj }));
      }
    },
    warn: (obj, msg) => {
      if (msg) {
        console.warn(JSON.stringify({ level: "warn", msg, ...obj }));
      } else {
        console.warn(JSON.stringify({ level: "warn", msg: obj }));
      }
    },
    debug: (obj, msg) => {
      if (msg) {
        console.debug(JSON.stringify({ level: "debug", msg, ...obj }));
      } else {
        console.debug(JSON.stringify({ level: "debug", msg: obj }));
      }
    },
  };
}

module.exports = logger;
