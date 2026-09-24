const router = require("express").Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/userProfileController");

router.get("/", requireAuth, getProfile);
router.put("/", requireAuth, updateProfile);

module.exports = router;
