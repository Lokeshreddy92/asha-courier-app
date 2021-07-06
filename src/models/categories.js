const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    category_desc: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
