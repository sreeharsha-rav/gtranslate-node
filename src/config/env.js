const path = require("path");
const fs = require("fs");

// Load environment variables based on NODE_ENV
function loadEnv() {
  const NODE_ENV = process.env.NODE_ENV || "development";

  // Load base .env file
  require("dotenv").config({
    path: path.resolve(process.cwd(), ".env"),
  });

  // Load environment specific files
  if (NODE_ENV !== "production") {
    require("dotenv").config({
      path: path.resolve(process.cwd(), ".env.local"),
      override: true,
    });
  }
}

// Validate environment variables
function validateEnv() {
  const required = ["GOOGLE_PROJECT_ID"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please check your .env file and make sure all required variables are set."
    );
  }

  // Validate service account key file exists
  const keyFilePath = path.join(
    process.cwd(),
    "credentials",
    "service-account-key.json"
  );
  if (!fs.existsSync(keyFilePath)) {
    throw new Error(
      "Service account key file not found.\n" +
        "Please place your service-account-key.json file in the credentials directory."
    );
  }

  try {
    // Validate the key file contains valid JSON
    const keyFileContent = fs.readFileSync(keyFilePath, "utf8");
    JSON.parse(keyFileContent);
  } catch (error) {
    throw new Error("Invalid service account key file format");
  }
}

let cachedConfig = null;

// Get config with default values
function getConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }

  const { getServiceAccountKey } = require("./google");

  cachedConfig = {
    google: {
      serviceAccountKey: getServiceAccountKey(),
      projectId: process.env.GOOGLE_PROJECT_ID,
    },
    server: {
      port: parseInt(process.env.PORT || "3000", 10),
      env: process.env.NODE_ENV || "development",
    },
  };

  return cachedConfig;
}

// Initialize configuration
function initializeConfig() {
  loadEnv();
  validateEnv();
  return getConfig();
}

module.exports = {
  initializeConfig,
  validateEnv,
  getConfig,
};
