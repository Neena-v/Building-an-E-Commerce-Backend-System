const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/product");

const createProduct = asyncHandler(async (req, res) => {
  const { name, category, price, description, image } = req.body;
  if (!name || !category || price === undefined) {
    return res.status(400).json({ message: "name, category, price required" });
  }
  if (price < 0) return res.status(400).json({ message: "price must be >= 0" });

  const product = await Product.create({ name, category, price, description, image });
  res.status(201).json(product);
});

const getProducts = asyncHandler(async (req, res) => {
  const { name, category, minPrice, maxPrice, sortBy, order } = req.query;

  const filter = {};
  if (name) filter.name = { $regex: name, $options: "i" };
  if (category) filter.category = { $regex: category, $options: "i" };

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  let sort = {};
  const sb = sortBy || "createdAt";
  const dir = (order || "desc") === "asc" ? 1 : -1;
  sort[sb] = dir;

  const products = await Product.find(filter).sort(sort);
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, price, description } = req.body;

  if (price !== undefined && price < 0) return res.status(400).json({ message: "price must be >= 0" });

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, category, price, description },
    { new: true, runValidators: true }
  );
  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
