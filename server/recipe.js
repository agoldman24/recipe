const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema(
  {
    name: String,
    image: {
      type: String
    },
    ingredients: Array,
    directions: String,
    authorName: String,
    authorId: String,
    isSample: Boolean
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);