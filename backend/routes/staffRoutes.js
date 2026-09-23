const express = require("express");
const bcrypt = require("bcryptjs");
const Staff = require("../models/Staff");

const router = express.Router();

/* =========================================================
   STAFF REGISTRATION
   POST /api/staff/register
========================================================= */
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, phone, role, password } = req.body;

    if (!name || !username || !email || !phone || !password) {
      return res.status(400).json({
        message: "Name, username, email, mobile number, and password are required."
      });
    }

    const cleanPhone = String(phone).trim();
    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({
        message: "Mobile number must contain exactly 10 digits."
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long."
      });
    }

    const cleanUsername = String(username).toLowerCase().trim();
    const cleanEmail = String(email).toLowerCase().trim();
    const assignedRole = role === "Admin" ? "Admin" : "Staff";

    // Check duplicate username or email
    const existingStaff = await Staff.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }]
    });

    if (existingStaff) {
      return res.status(409).json({
        message: existingStaff.username === cleanUsername
          ? "This username is already taken."
          : "An account with this email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staffMember = await Staff.create({
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      phone: cleanPhone,
      role: assignedRole,
      password: hashedPassword
    });

    const staffResponse = staffMember.toObject();
    delete staffResponse.password;

    res.status(201).json({
      message: `${assignedRole} account created successfully!`,
      staff: staffResponse
    });
  } catch (error) {
    console.error("Staff registration error:", error);
    res.status(500).json({
      message: "Failed to register staff account",
      error: error.message
    });
  }
});

/* =========================================================
   STAFF LOGIN
   POST /api/staff/login
========================================================= */
router.post("/login", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username/Email and password are required."
      });
    }

    const searchIdentifier = String(username).toLowerCase().trim();

    // Find by username or email
    const staffMember = await Staff.findOne({
      $or: [{ username: searchIdentifier }, { email: searchIdentifier }]
    });

    if (!staffMember) {
      return res.status(401).json({
        message: "Invalid staff credentials."
      });
    }

    // Role check if provided
    if (role && staffMember.role.toLowerCase() !== String(role).toLowerCase()) {
      return res.status(401).json({
        message: `Account role does not match selected role (${role}).`
      });
    }

    const passwordMatch = await bcrypt.compare(password, staffMember.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid staff credentials."
      });
    }

    const staffResponse = staffMember.toObject();
    delete staffResponse.password;

    res.status(200).json({
      message: "Staff authentication successful!",
      staff: staffResponse
    });
  } catch (error) {
    console.error("Staff login error:", error);
    res.status(500).json({
      message: "Failed to authenticate staff",
      error: error.message
    });
  }
});

/* =========================================================
   GET ALL STAFF (ADMIN ONLY)
========================================================= */
router.get("/", async (req, res) => {
  try {
    const staffList = await Staff.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      message: "Staff members fetched successfully",
      staff: staffList
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch staff members",
      error: error.message
    });
  }
});

module.exports = router;
