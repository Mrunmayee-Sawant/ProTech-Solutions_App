const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

       status: {
    type: String,
    enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ],
    default: "Pending"
},

paymentMethod: {
    type: String,
    enum: [
        "UPI",
        "Card",
        "NetBanking",
        "Cash"
    ],
    default: "Cash"
}
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);
