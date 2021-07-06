const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const UserEducationSchema = new Schema(
  {
    level: {
      type: String,
      required: true,
    },
    institute: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    score: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Education", UserEducationSchema);
