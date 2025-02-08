const Router = require("@koa/router");
const router = new Router();

router.get("/health", async (ctx) => {
  ctx.status = 200;
  ctx.body = { status: "healthy" };
});

module.exports = router;
