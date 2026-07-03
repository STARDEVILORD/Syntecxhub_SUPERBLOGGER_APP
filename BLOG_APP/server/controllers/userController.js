const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    const allowed = ["name", "gender", "dateOfBirth", "bio"];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    if (req.body.hobbies !== undefined) {
      updates.hobbies = Array.isArray(req.body.hobbies)
        ? req.body.hobbies
        : req.body.hobbies.split(",").map((h) => h.trim());
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
