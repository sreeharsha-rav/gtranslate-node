const { JWT } = require("google-auth-library");
const { getConfig } = require("../config/env");

// Cache both the JWT client and token
let jwtClient = null;
let cachedToken = null;
let tokenExpiryTime = null;

// Buffer time before token expiry (5 minutes in milliseconds)
const TOKEN_BUFFER = 5 * 60 * 1000;

async function getJWTClient() {
  if (!jwtClient) {
    const config = getConfig();
    jwtClient = new JWT({
      email: config.google.serviceAccountKey.client_email,
      key: config.google.serviceAccountKey.private_key,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
  }
  return jwtClient;
}

async function getAuthToken() {
  const now = Date.now();

  // Return cached token if it's still valid
  if (cachedToken && tokenExpiryTime && now < tokenExpiryTime - TOKEN_BUFFER) {
    return cachedToken;
  }

  // Get new token
  const client = await getJWTClient();
  const token = await client.getAccessToken();

  // Cache the token and set expiry time
  cachedToken = token.token;

  // Set expiry time from token.res.data.expiry_date or default to 1 hour
  tokenExpiryTime = token.res?.data?.expiry_date
    ? parseInt(token.res.data.expiry_date)
    : now + 3600000;

  return cachedToken;
}

module.exports = { getJWTClient, getAuthToken };
