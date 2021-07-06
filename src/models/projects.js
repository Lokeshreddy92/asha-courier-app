const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    project_name: {
      type: String,
      required: true,
    },
    project_desc: {
      type: String,
    },
    img_url: {
      type: String,
    },
    assignedUsers: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
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

module.exports = mongoose.model("Projects", projectSchema);
