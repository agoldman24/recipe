const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    profileImageId: String,
    followerIds: Array,
    followingIds: Array,
    createdRecipeIds: Array,
    likedRecipeIds: Array
  }
);

module.exports = mongoose.model("User", UserSchema);