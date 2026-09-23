const express = require("express");
const bcrypt = require("bcryptjs");
const Customer = require("../models/Customer");

const router = express.Router();

/* =========================================================
   CREATE A CUSTOMER / CUSTOMER REGISTRATION
========================================================= */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      password,
      city,
      pincode
    } = req.body;

    // Check required registration fields
    if (!name || !phone || !email || !address || !password) {
      return res.status(400).json({
        message: "Name, phone, email, address, and password are required."
      });
    }

    // Strict 10-digit mobile number validation
    const cleanPhone = String(phone).trim();

    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        message: "Mobile number must contain exactly 10 digits."
      });
    }

    // Password length validation
    if (String(password).length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long."
      });
    }

    // Check whether email already exists
    const cleanEmail = email.toLowerCase().trim();

    const existingCustomer = await Customer.findOne({
      email: cleanEmail
    });

    if (existingCustomer) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create customer
    const customer = await Customer.create({
      name: name.trim(),
      phone: cleanPhone,
      email: cleanEmail,
      address: address.trim(),
      password: hashedPassword,
      city: city ? city.trim() : "Thane",
      pincode: pincode ? pincode.trim() : "400601"
    });

    // Remove password before sending customer data
    const customerResponse =
      customer.toObject();

    delete customerResponse.password;

    return res.status(201).json({
      message: "Account created successfully!",
      customer: customerResponse
    });

  } catch (error) {

    console.error(
      "Create customer error:",
      error
    );

    return res.status(500).json({
      message: "Failed to create customer account",
      error: error.message
    });
  }
});


/* =========================================================
   CUSTOMER LOGIN
========================================================= */
router.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    /* -----------------------------------------------------
       CHECK LOGIN FIELDS
    ----------------------------------------------------- */

    if (!email || !password) {

      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    /* -----------------------------------------------------
       CLEAN EMAIL
    ----------------------------------------------------- */

    const cleanEmail =
      email.toLowerCase().trim();

    /* -----------------------------------------------------
       FIND CUSTOMER
    ----------------------------------------------------- */

    const customer =
      await Customer.findOne({
        email: cleanEmail
      });

    /*
     * If the email does not exist, keep the response
     * generic for security.
     */
    if (!customer) {

      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    /* -----------------------------------------------------
       CHECK WHETHER PASSWORD EXISTS
    ----------------------------------------------------- */

    if (!customer.password) {

      return res.status(401).json({
        message:
          "This account has no password set. Please register again."
      });
    }

    /* -----------------------------------------------------
       COMPARE PASSWORD
    ----------------------------------------------------- */

    const passwordMatch =
      await bcrypt.compare(
        password,
        customer.password
      );

    /* -----------------------------------------------------
       WRONG PASSWORD
    ----------------------------------------------------- */

    if (!passwordMatch) {

      return res.status(401).json({
        message: "Invalid password."
      });
    }

    /* -----------------------------------------------------
       LOGIN SUCCESSFUL
    ----------------------------------------------------- */

    const customerResponse =
      customer.toObject();

    /*
     * Never send the hashed password
     * to the frontend.
     */
    delete customerResponse.password;

    return res.status(200).json({
      message: "Login successful!",
      customer: customerResponse
    });

  } catch (error) {

    console.error(
      "Customer login error:",
      error
    );

    return res.status(500).json({
      message: "Failed to login customer",
      error: error.message
    });
  }
});


/* =========================================================
   FORGOT PASSWORD - VERIFY EMAIL
========================================================= */
router.post("/forgot-password", async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {

      return res.status(400).json({
        message: "Email address is required."
      });
    }

    const cleanEmail =
      email.toLowerCase().trim();

    const customer =
      await Customer.findOne({
        email: cleanEmail
      });

    if (!customer) {

      return res.status(404).json({
        message:
          "No customer account found with this email."
      });
    }

    return res.status(200).json({
      message:
        "Email verified successfully. You can reset your password."
    });

  } catch (error) {

    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while verifying email."
    });
  }
});


/* =========================================================
   RESET PASSWORD
========================================================= */
router.put("/reset-password", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        message:
          "Email and new password are required."
      });
    }

    if (String(password).length < 6) {

      return res.status(400).json({
        message:
          "Password must be at least 6 characters long."
      });
    }

    const cleanEmail =
      email.toLowerCase().trim();

    const customer =
      await Customer.findOne({
        email: cleanEmail
      });

    if (!customer) {

      return res.status(404).json({
        message:
          "Customer account not found."
      });
    }

    /* Hash the new password */
    customer.password =
      await bcrypt.hash(
        password,
        10
      );

    await customer.save();

    return res.status(200).json({
      message:
        "Password reset successfully. You can now login."
    });

  } catch (error) {

    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while resetting password."
    });
  }
});


/* =========================================================
   GET ALL CUSTOMERS (STAFF/ADMIN)
========================================================= */
router.get("/", async (req, res) => {

  try {

    const customers =
      await Customer.find()
        .select("-password")
        .sort({
          createdAt: -1
        });

    return res.status(200).json({
      message:
        "Customers fetched successfully",
      customers
    });

  } catch (error) {

    console.error(
      "Get customers error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch customers",
      error: error.message
    });
  }
});


/* =========================================================
   GET ALL SERVICES FOR A CUSTOMER
========================================================= */
router.get(
  "/:customerId/services",
  async (req, res) => {

    try {

      const Service =
        require("../models/Service");

      const services =
        await Service.find({
          customerId:
            req.params.customerId
        }).sort({
          serviceDate: -1
        });

      return res.status(200).json({
        message:
          "Customer services fetched successfully",
        services
      });

    } catch (error) {

      console.error(
        "Get customer services error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch customer services",
        error: error.message
      });
    }
  }
);


/* =========================================================
   GET ONE CUSTOMER BY ID
========================================================= */
router.get("/:id", async (req, res) => {

  try {

    const customer =
      await Customer.findById(
        req.params.id
      ).select("-password");

    if (!customer) {

      return res.status(404).json({
        message:
          "Customer not found"
      });
    }

    return res.status(200).json({
      message:
        "Customer fetched successfully",
      customer
    });

  } catch (error) {

    console.error(
      "Get customer error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch customer",
      error: error.message
    });
  }
});


/* =========================================================
   UPDATE CUSTOMER PROFILE
========================================================= */
router.put("/:id", async (req, res) => {

  try {

    const updateData = {
      ...req.body
    };

    /* -----------------------------------------------------
       PHONE VALIDATION
    ----------------------------------------------------- */

    if (
      updateData.phone &&
      !/^\d{10}$/.test(
        String(updateData.phone).trim()
      )
    ) {

      return res.status(400).json({
        message:
          "Mobile number must contain exactly 10 digits."
      });
    }

    /* -----------------------------------------------------
       PASSWORD VALIDATION + HASHING
    ----------------------------------------------------- */

    if (updateData.password) {

      if (
        String(updateData.password).length < 6
      ) {

        return res.status(400).json({
          message:
            "Password must be at least 6 characters long."
        });
      }

      updateData.password =
        await bcrypt.hash(
          updateData.password,
          10
        );
    }

    /* -----------------------------------------------------
       UPDATE CUSTOMER
    ----------------------------------------------------- */

    const customer =
      await Customer.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      ).select("-password");

    if (!customer) {

      return res.status(404).json({
        message:
          "Customer not found"
      });
    }

    return res.status(200).json({
      message:
        "Customer updated successfully",
      customer
    });

  } catch (error) {

    console.error(
      "Update customer error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update customer",
      error: error.message
    });
  }
});


/* =========================================================
   DELETE CUSTOMER
========================================================= */
router.delete("/:id", async (req, res) => {

  try {

    const customer =
      await Customer.findByIdAndDelete(
        req.params.id
      );

    if (!customer) {

      return res.status(404).json({
        message:
          "Customer not found"
      });
    }

    const customerResponse =
      customer.toObject();

    delete customerResponse.password;

    return res.status(200).json({
      message:
        "Customer deleted successfully",
      customer: customerResponse
    });

  } catch (error) {

    console.error(
      "Delete customer error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete customer",
      error: error.message
    });
  }
});


/* =========================================================
   EXPORT ROUTER
========================================================= */

module.exports = router;