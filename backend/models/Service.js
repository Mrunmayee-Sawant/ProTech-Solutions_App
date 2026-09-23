const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        serviceType: {
            type: String,
            enum: [
                "Installation",
                "Maintenance",
                "Repair",
                "Camera Replacement",
                "DVR/NVR Service",
                "AMC Service"
            ],
            required: true
        },

        cctvType: {
            type: String,
            enum: [
                "Indoor Camera",
                "Outdoor Camera",
                "IP Camera",
                "Dome Camera",
                "Bullet Camera"
            ],
            default: ""
        },

        serviceDate: {
            type: Date,
            required: true
        },

        preferredTime: {
            type: String,
            enum: [
                "9 AM - 11 AM",
                "11 AM - 1 PM",
                "2 PM - 4 PM",
                "4 PM - 6 PM"
            ],
            default: ""
        },

        address: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            default: ""
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

        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Service", serviceSchema);
