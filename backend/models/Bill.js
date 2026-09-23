const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
    {
        billId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        billType: {
            type: String,
            enum: ["Product", "Service"],
            required: true
        },

        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            default: null
        },

        requestId: {
            type: String,
            default: null,
            trim: true
        },

        serviceType: {
            type: String,
            default: null,
            trim: true
        },

        serviceCharge: {
            type: Number,
            default: 0,
            min: 0
        },

        gst: {
            type: Number,
            required: true,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        paidAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        balanceAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        billDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Partially Paid"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Bill", billSchema);