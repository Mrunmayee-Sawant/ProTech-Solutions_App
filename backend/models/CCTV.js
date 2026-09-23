const mongoose = require("mongoose");

const cctvSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        customerName: {
            type: String,
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
            required: true
        },

        cameraCount: {
            type: Number,
            required: true,
            min: 1
        },

        recorder: {
            type: String,
            enum: [
                "DVR",
                "NVR",
                "No Recorder"
            ],
            required: true
        },

        storage: {
            type: String,
            enum: [
                "500 GB",
                "1 TB",
                "2 TB",
                "4 TB"
            ],
            required: true
        },

        location: {
            type: String,
            required: true
        },

        installationDate: {
            type: Date,
            required: true
        },

        additionalDetails: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("CCTV", cctvSchema);
