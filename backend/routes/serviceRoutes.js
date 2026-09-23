const express = require("express");
const router = express.Router();

const Service = require("../models/Service");
const Customer = require("../models/Customer");

/* =========================================================
   CREATE SERVICE
========================================================= */
router.post("/", async (req, res) => {
  try {
    const {
      customerId,
      serviceType,
      cctvType,
      serviceDate,
      preferredTime,
      address,
      description,
      status,
      notes
    } = req.body;

    if (!customerId || !serviceType || !serviceDate) {
      return res.status(400).json({
        message: "customerId, serviceType and serviceDate are required"
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    const service = new Service({
      customerId,
      serviceType,
      cctvType: cctvType || "",
      serviceDate,
      preferredTime: preferredTime || "",
      address: address || "",
      description: description || "",
      status: status || "Pending",
      notes: notes || ""
    });

    const savedService = await service.save();

    return res.status(201).json({
      message: "Service request created successfully",
      serviceRequest: savedService
    });
  } catch (error) {
    console.error("ERROR CREATING SERVICE:", error);
    return res.status(500).json({
      message: "Error creating service",
      error: error.message
    });
  }
});

/* =========================================================
   GET ALL SERVICES
========================================================= */
router.get("/", async (req, res) => {
  try {
    const services = await Service.find()
      .populate("customerId", "name phone email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Services fetched successfully",
      services
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching services",
      error: error.message
    });
  }
});

/* =========================================================
   GET SERVICES FOR ONE CUSTOMER
========================================================= */
router.get("/customer/:customerId", async (req, res) => {
  try {
    const services = await Service.find({ customerId: req.params.customerId })
      .populate("customerId", "name phone email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Customer service requests fetched successfully",
      serviceRequests: services
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching customer service requests",
      error: error.message
    });
  }
});

/* =========================================================
   GET ONE SERVICE
========================================================= */
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("customerId", "name phone email");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({
      message: "Service fetched successfully",
      serviceRequest: service
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching service",
      error: error.message
    });
  }
});

/* =========================================================
   UPDATE SERVICE
========================================================= */
router.put("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("customerId", "name phone email");

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({
      message: "Service updated successfully",
      service
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating service",
      error: error.message
    });
  }
});

/* =========================================================
   DELETE SERVICE
========================================================= */
router.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({
      message: "Service deleted successfully",
      service
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting service",
      error: error.message
    });
  }
});

module.exports = router;
