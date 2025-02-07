const Router = require("@koa/router");
const {
  listVoices,
  synthesizeSpeech,
} = require("../services/textToSpeechService");

const router = new Router({ prefix: "/api/tts" });

// GET /api/tts/voices - List available voices
router.get("/voices", async (ctx) => {
  try {
    const { languageCode } = ctx.query;
    const voices = await listVoices(languageCode);
    ctx.body = { voices };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
    ctx.app.emit("error", error, ctx);
  }
});

// POST /api/tts/synthesize - Synthesize speech from text
router.post("/synthesize", async (ctx) => {
  try {
    const { text, voice, audioConfig } = ctx.request.body;

    if (!text || !voice) {
      ctx.status = 400;
      ctx.body = { error: "Text and voice configuration are required" };
      return;
    }

    const audioContent = await synthesizeSpeech(text, voice, audioConfig);
    ctx.body = { audioContent };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
    ctx.app.emit("error", error, ctx);
  }
});

module.exports = router;
