const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  placeOrder, getMyOrders, getOrderById, updateOrderStatus
} = require("../controllers/orderController");

router.post("/", requireAuth, placeOrder);
router.get("/mine", requireAuth, getMyOrders);

router.get("/:id", requireAuth, getOrderById);
router.patch("/:id/status", requireAuth, requireRole("admin"), updateOrderStatus);

module.exports = router;
