const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    billId: {
      type: String,
      default: null,
      trim: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    method: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    reference: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      required: true,
      enum: ["Paid", "Partially Paid", "Pending"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);