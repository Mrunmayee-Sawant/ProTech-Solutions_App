const express = require("express");
const CCTV = require("../models/CCTV");

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "CCTV routes are working!" });
});

router.post("/", async (req, res) => {
  try {
    const cctv = await CCTV.create(req.body);
    res.status(201).json({
      message: "CCTV details saved successfully",
      cctv
    });
  } catch (error) {
    console.error("Create CCTV error:", error);
    res.status(500).json({
      message: "Failed to save CCTV details",
      error: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const cctvDetails = await CCTV.find()
      .populate("customerId", "name phone email")
      .sort({ createdAt: -1 });

    res.json({
      message: "CCTV details fetched successfully",
      cctvDetails
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch CCTV details",
      error: error.message
    });
  }
});

router.get("/customer/:customerId", async (req, res) => {
  try {
    const cctvDetails = await CCTV.find({
      customerId: req.params.customerId
    }).sort({ createdAt: -1 });

    res.json({
      message: "Customer CCTV details fetched successfully",
      cctvDetails
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch customer CCTV details",
      error: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cctv = await CCTV.findById(req.params.id)
      .populate("customerId", "name phone email");

    if (!cctv) {
      return res.status(404).json({ message: "CCTV details not found" });
    }

    res.json({
      message: "CCTV details fetched successfully",
      cctv
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch CCTV details",
      error: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const cctv = await CCTV.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!cctv) {
      return res.status(404).json({ message: "CCTV details not found" });
    }

    res.json({
      message: "CCTV details updated successfully",
      cctv
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update CCTV details",
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const cctv = await CCTV.findByIdAndDelete(req.params.id);
    if (!cctv) {
      return res.status(404).json({ message: "CCTV details not found" });
    }

    res.json({
      message: "CCTV details deleted successfully",
      cctv
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete CCTV details",
      error: error.message
    });
  }
});

module.exports = router;
