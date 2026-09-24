const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  createProduct, getProducts, getProductById, updateProduct, deleteProduct
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", requireAuth, requireRole("admin"), createProduct);
router.put("/:id", requireAuth, requireRole("admin"), updateProduct);
router.delete("/:id", requireAuth, requireRole("admin"), deleteProduct);

module.exports = router;
