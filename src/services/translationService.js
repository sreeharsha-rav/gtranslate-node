const { getConfig } = require("../config/env");
const { getAuthToken } = require("./authService");

// translate text from source language to target language
async function translateText(text, sourceLang, targetLang) {
  if (!text?.trim() || !sourceLang || !targetLang) {
    throw new Error("Missing required parameters");
  }

  try {
    const config = getConfig();
    const token = await getAuthToken();

    const response = await fetch(
      `https://translation.googleapis.com/v3/projects/${config.google.projectId}/locations/global:translateText`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceLanguageCode: sourceLang,
          targetLanguageCode: targetLang,
          contents: [text.trim()],
          mimeType: "text/plain", // Specify the content type
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Translation failed");
    }

    const data = await response.json();

    if (!data.translations?.[0]?.translatedText) {
      throw new Error("No translation returned");
    }

    return data;
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error(`Translation failed: ${error.message}`);
  }
}

// detect language of the text
async function detectLanguage(text) {
  if (!text?.trim()) {
    throw new Error("Text is required");
  }

  try {
    const config = getConfig();
    const token = await getAuthToken();

    const response = await fetch(
      `https://translation.googleapis.com/v3/projects/${config.google.projectId}/locations/global:detectLanguage`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: text.trim(),
          mimeType: "text/plain",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Language detection failed");
    }

    const data = await response.json();
    return {
      languageCode: data.languages?.[0]?.languageCode,
      confidence: data.languages?.[0]?.confidence,
    };
  } catch (error) {
    console.error("Language detection error:", error);
    throw new Error(`Language detection failed: ${error.message}`);
  }
}

// list supported languages
async function listSupportedLanguages(displayLanguage = "en") {
  try {
    const config = getConfig();
    const token = await getAuthToken();

    const response = await fetch(
      `https://translation.googleapis.com/v3/projects/${config.google.projectId}/locations/global/supportedLanguages?displayLanguageCode=${displayLanguage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error?.message || "Failed to fetch supported languages"
      );
    }

    const data = await response.json();
    return data.languages || [];
  } catch (error) {
    console.error("Error fetching supported languages:", error);
    throw new Error(`Failed to fetch supported languages: ${error.message}`);
  }
}

module.exports = {
  translateText,
  detectLanguage,
  listSupportedLanguages,
};
