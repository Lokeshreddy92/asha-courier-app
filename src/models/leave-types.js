const mongoose = require("mongoose"),
  AutoIncrement = require("mongoose-sequence")(mongoose),
  Schema = mongoose.Schema;

const leaveTypesSchema = new Schema(
  {
    leave_type: {
      type: String,
      required: true,
    },
    leave_desc: {
      type: String,
    },
    no_of_days: {
      type: Number,
    },
    carry_forward: {
      type: Number,
    },
    any_validation: {
      type: Boolean,
      default: false,
    },
    allowed_days: {
      type: Number,
    },
    message: {
      type: String,
    },
    leave_type_id: {
      type: Number,
      index: { unique: true },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

leaveTypesSchema.plugin(AutoIncrement, { inc_field: "leave_type_id" });

module.exports = mongoose.model("LeaveTypes", leaveTypesSchema);
