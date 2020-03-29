const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
  {
    data: {
      type: String
    }
  }
);

module.exports = mongoose.model("Image", ImageSchema);