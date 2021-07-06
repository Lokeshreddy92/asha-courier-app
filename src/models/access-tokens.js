const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const accessTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccessToken", accessTokenSchema);
