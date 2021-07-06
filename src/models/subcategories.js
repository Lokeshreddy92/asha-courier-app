const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const subCategorySchema = new Schema(
  {
    sub_category_name: {
      type: String,
      required: true,
    },
    sub_category_desc: {
      type: String,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
