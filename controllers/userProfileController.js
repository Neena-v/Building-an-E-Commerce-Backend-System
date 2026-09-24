const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/user");

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select("-passwordHash");
  res.json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, address } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { name, address },
    { new: true, runValidators: true }
  ).select("-passwordHash");

  res.json(user);
});

module.exports = { getProfile, updateProfile };
