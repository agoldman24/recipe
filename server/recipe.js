const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new Schema(
  {
    name: String,
    image: {
      type: String
    },
    ingredients: Array,
    directions: Schema.Types.Mixed,
    authorName: String,
    authorId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);