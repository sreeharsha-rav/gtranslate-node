const requiredEnvVars = ["GOOGLE_PROJECT_ID", "GOOGLE_SERVICE_ACCOUNT_KEY"];

// Cache for config
let configCache = null;

function validateEnv() {
  // Add PORT to required variables if you want to ensure it's set
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(", ")}`);
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please configure these in Cloud Run environment variables.",
    );
  }

  // Log available configuration for debugging
  console.log("Environment validation passed");
  console.log(`PORT: ${process.env.PORT || "8080"}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || "production"}`);
}

function getConfig() {
  // Return cached config if available
  if (configCache) {
    return configCache;
  }

  validateEnv();

  // Create new config and cache it
  configCache = {
    google: {
      projectId: process.env.GOOGLE_PROJECT_ID,
      serviceAccountKey: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
    },
    server: {
      port: parseInt(process.env.PORT || "8080", 10),
      env: process.env.NODE_ENV || "production",
    },
    cors: {
      origins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : ["*"],
    },
  };

  return configCache;
}

module.exports = { getConfig, validateEnv };
