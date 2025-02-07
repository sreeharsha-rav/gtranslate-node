const Router = require("@koa/router");
const {
  translateText,
  listSupportedLanguages,
  detectLanguage,
} = require("../services/translationService");

const router = new Router({ prefix: "/api/translate" });

// POST /api/translate - Translate text from source language to target language
router.post("/", async (ctx) => {
  try {
    const { text, sourceLang, targetLang } = ctx.request.body;
    const result = await translateText(text, sourceLang, targetLang);
    ctx.body = result;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: error.message };
  }
});

// GET /api/translate/supported-languages - List supported languages
router.get("/supported-languages", async (ctx) => {
  try {
    const result = await listSupportedLanguages();
    ctx.body = result;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: error.message };
  }
});

// GET /api/translate/detect-language - Detect language of the text
router.get("/detect-language", async (ctx) => {
  try {
    const { text } = ctx.request.body;
    const result = await detectLanguage(text);
    ctx.body = result;
  } catch (error) {
    ctx.status = 400;
    ctx.body = { error: error.message };
  }
});

module.exports = router;
