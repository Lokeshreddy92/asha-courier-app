const mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const courierOrderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    qty: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    orderId: {
      type: Number,
      default: new Date().getTime(),
      required: true,
      unique: true,
    },
    from: {
      type: Object,
      required: true,
    },
    to: {
      type: Object,
      required: true,
    },
    location: {
      type: {
        type: String,
      },
      coordinates: [Number],
    },
    status: {
      type: String,
      enum: [
        "Confirmed",
        "Shipped",
        "Faild to Ship",
        "Out for Delivery",
        "Delivered",
        "Failed to Deliver",
      ],
      default: "Confirmed",
    },
    shipped_date: {
      type: Date,
    },
    delivered_date: {
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
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CourierOrder", courierOrderSchema);
