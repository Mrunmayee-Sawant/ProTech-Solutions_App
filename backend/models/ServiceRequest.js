const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        requestId: {
            type: String,
            unique: true,
            required: true
        },

        customerName: {
            type: String,
            required: true,
            trim: true
        },

        mobile: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function(v) {
                    return /^\d{10}$/.test(v);
                },
                message: "Mobile number must be exactly 10 digits."
            }
        },

        serviceType: {
            type: String,
            required: true,
            trim: true
        },

        cctvType: {
            type: String,
            required: true,
            trim: true
        },

        problemDescription: {
            type: String,
            required: true,
            trim: true
        },

        serviceLocation: {
            type: String,
            required: true,
            trim: true
        },

        serviceDate: {
            type: String,
            required: true
        },

        serviceTime: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "In Progress",
                "Completed",
                "Cancelled"
            ],
            default: "Pending"
        },

        technicianNotes: {
            type: String,
            default: "",
            trim: true
        }
    },
    {
        timestamps: true
    }
);


// Automatically create request ID if missing
serviceRequestSchema.pre("validate", function(next) {

    if (!this.requestId) {
        this.requestId = "SR" + Date.now();
    }

    if (typeof next === "function") {
        next();
    }

});


module.exports = mongoose.model(
    "ServiceRequest",
    serviceRequestSchema
);