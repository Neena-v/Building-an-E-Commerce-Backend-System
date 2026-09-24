const router = require("express").Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { recommendProducts } = require("../controllers/analyticsController");

router.post("/recommend", requireAuth, recommendProducts);

module.exports = router;
