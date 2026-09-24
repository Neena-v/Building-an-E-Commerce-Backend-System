const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user");

function signToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

const register = asyncHandler(async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password) return res.status(400).json({ message: "email & password required" });
  if (password.length < 6) return res.status(400).json({ message: "password must be >= 6 chars" });

  const safeRole = role && role === "admin" ? "user" : (role || "user");

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    passwordHash,
    name: name || "",
    role: safeRole
  });

  const token = signToken(user);
  res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "email & password required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);
  res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
});

module.exports = { register, login };
