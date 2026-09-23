const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
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

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    city: {
      type: String,
      trim: true,
      default: "Thane"
    },

    pincode: {
      type: String,
      trim: true,
      default: "400601"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Customer", customerSchema);
