const { JWT } = require("google-auth-library");
const logger = require("../services/logger");

// Cache the JWT client to reuse it
let jwtClient = null;

function getServiceAccountKey() {
  try {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      throw new Error(
        "GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set",
      );
    }
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  } catch (error) {
    logger.error({ error }, "Failed to parse service account key");
    throw new Error("Invalid service account key format");
  }
}

function getJWTClient() {
  if (!jwtClient) {
    const credentials = getServiceAccountKey();
    jwtClient = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
  }
  return jwtClient;
}

async function getGoogleAuthToken() {
  try {
    const client = getJWTClient();
    const token = await client.getAccessToken();
    return token.token;
  } catch (error) {
    logger.error({ error }, "Authentication failed");
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

module.exports = { getGoogleAuthToken, getJWTClient, getServiceAccountKey };
