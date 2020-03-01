const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    friendIds: Array,
    createdRecipeIds: Array,
    friendRecipeIds: Array,
    sampleRecipeIds: Array
  }
);

module.exports = mongoose.model("User", UserSchema);