const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    phone: {
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

    role: {
      type: String,
      enum: ["Admin", "Staff"],
      default: "Staff",
      required: true
    },

    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Staff", staffSchema);
