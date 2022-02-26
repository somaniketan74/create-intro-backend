const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  authUserId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
  profileImage: { type: String },
  category: { type: String },
  username: { type: String, required: true, unique: true },
  Facebook: { type: String },
  Instagram: { type: String },
  Linkedin: { type: String },
  Twitter: { type: String }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;
