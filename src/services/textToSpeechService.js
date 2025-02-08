const { getAuthToken } = require("./authService");
const { getConfig } = require("../config/cloudConfig");
const logger = require("./logger");

// list voices available for speech synthesis
async function listVoices(languageCode = null) {
  try {
    const token = await getAuthToken();
    const config = getConfig();

    const url = new URL("https://texttospeech.googleapis.com/v1/voices");
    if (languageCode) {
      url.searchParams.append("languageCode", languageCode);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-goog-user-project": config.google.projectId,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to fetch voices");
    }

    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    logger.error({ error }, "Failed to fetch voices");
    throw new Error(`Failed to fetch voices: ${error.message}`);
  }
}

// synthesize speech from text
async function synthesizeSpeech(
  text,
  voice,
  audioConfig = { audioEncoding: "MP3" },
) {
  if (!text?.trim()) {
    throw new Error("Text is required");
  }

  try {
    const token = await getAuthToken();
    const config = getConfig();

    const response = await fetch(
      "https://texttospeech.googleapis.com/v1/text:synthesize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-goog-user-project": config.google.projectId,
        },
        body: JSON.stringify({
          input: { text: text.trim() },
          voice: {
            languageCode: voice.languageCode,
            name: voice.name,
            ssmlGender: voice.ssmlGender,
          },
          audioConfig,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Speech synthesis failed");
    }

    const data = await response.json();
    return data.audioContent; // Returns base64 encoded audio content
  } catch (error) {
    logger.error({ error }, "Speech synthesis failed");
    throw new Error(`Speech synthesis failed: ${error.message}`);
  }
}

module.exports = {
  listVoices,
  synthesizeSpeech,
};
