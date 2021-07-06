const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const attachmentSchema = new Schema(
  {
    attachment_name: {
      type: String,
      required: true,
    },
    attachment_desc: {
      type: String,
      required: true,
    },
    attachment_url: {
      type: String,
    },
    type: {
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

module.exports = mongoose.model("Attachment", attachmentSchema);
