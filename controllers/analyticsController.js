const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/product");
const { fetchRecommendationsFromRapidMiner } = require("../services/recommendationService");

const recommendProducts = asyncHandler(async (req, res) => {
  
  const userId = req.user ? req.user.userId : null;


  const rm = await fetchRecommendationsFromRapidMiner({ userId });

  const productIds = rm?.productIds || [];
  if (productIds.length === 0) return res.json({ products: [], source: "rapidminer" });

  
  const products = await Product.find({ _id: { $in: productIds } });
  res.json({ products, source: "rapidminer" });
});

module.exports = { recommendProducts };
