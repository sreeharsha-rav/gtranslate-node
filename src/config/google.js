const { JWT } = require("google-auth-library");
const fs = require("fs");
const path = require("path");

async function getGoogleAuthToken() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const token = await client.getAccessToken();
    return token.token;
  } catch (error) {
    console.error("Auth error:", error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

// Cache the JWT client to reuse it
let jwtClient = null;

function getJWTClient() {
  if (!jwtClient) {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    jwtClient = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
  }
  return jwtClient;
}

function getServiceAccountKey() {
  try {
    // Read the service account key file
    const keyFilePath = path.join(
      process.cwd(),
      "credentials",
      "service-account-key.json"
    );
    const keyFileContent = fs.readFileSync(keyFilePath, "utf8");
    return JSON.parse(keyFileContent);
  } catch (error) {
    console.error("Error reading service account key:", error);
    throw new Error("Failed to load service account key");
  }
}

module.exports = { getGoogleAuthToken, getJWTClient, getServiceAccountKey };
