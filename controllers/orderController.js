const asyncHandler = require("../utils/asyncHandler");
const Order = require("../models/order");
const Product = require("../models/product");

const placeOrder = asyncHandler(async (req, res) => {
  const { items } = req.body; 

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "items array required" });
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const it of items) {
    const { productId, quantity } = it || {};
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Each item needs productId and quantity>=1" });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: `Product not found: ${productId}` });

    totalAmount += product.price * quantity;
    orderItems.push({
      productId,
      quantity,
      priceAtPurchase: product.price
    });
  }

  const order = await Order.create({
    userId: req.user.userId,
    items: orderItems,
    totalAmount,
    status: "pending"
  });

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.productId", "name category price");
  if (!order) return res.status(404).json({ message: "Order not found" });

  if (order.userId.toString() !== req.user.userId && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json(order);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "paid", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

module.exports = { placeOrder, getMyOrders, getOrderById, updateOrderStatus };
