const express = require("express");
const ServiceRequest = require("../models/ServiceRequest");

const router = express.Router();


router.get("/test", (req, res) => {

  res.json({
    message: "Service Request routes are working!"
  });

});


router.post("/", async (req, res) => {

  try {

    const serviceRequest =
      await ServiceRequest.create(req.body);

    res.status(201).json({

      message:
        "Service request created successfully",

      serviceRequest

    });

  } catch (error) {

    console.error(
      "Create service request error:",
      error
    );

    res.status(500).json({

      message:
        "Failed to create service request",

      error:
        error.message

    });

  }

});


router.get("/", async (req, res) => {

  try {

    const serviceRequests =
      await ServiceRequest.find()
        .populate("customerId")
        .sort({ createdAt: -1 });

    res.json({

      message:
        "Service requests fetched successfully",

      serviceRequests

    });

  } catch (error) {

    res.status(500).json({

      message:
        "Failed to fetch service requests",

      error:
        error.message

    });

  }

});


router.get("/customer/:customerId", async (req, res) => {

  try {

    const serviceRequests =
      await ServiceRequest.find({

        customerId:
          req.params.customerId

      }).sort({
        createdAt: -1
      });

    res.json({

      message:
        "Customer service requests fetched successfully",

      serviceRequests

    });

  } catch (error) {

    res.status(500).json({

      message:
        "Failed to fetch customer service requests",

      error:
        error.message

    });

  }

});


router.get("/:id", async (req, res) => {

  try {

    const serviceRequest =
      await ServiceRequest.findById(
        req.params.id
      ).populate("customerId");


    if (!serviceRequest) {

      return res.status(404).json({

        message:
          "Service request not found"

      });

    }


    res.json({

      message:
        "Service request fetched successfully",

      serviceRequest

    });

  } catch (error) {

    res.status(500).json({

      message:
        "Failed to fetch service request",

      error:
        error.message

    });

  }

});


router.put("/:id/status", async (req, res) => {

  try {

    const {
      status,
      technicianNotes
    } = req.body;


    const allowedStatuses = [

      "Pending",
      "Confirmed",
      "In Progress",
      "Completed",
      "Cancelled"

    ];


    if (!allowedStatuses.includes(status)) {

      return res.status(400).json({

        message:
          "Invalid service request status",

        allowedStatuses

      });

    }


    const serviceRequest =
      await ServiceRequest.findByIdAndUpdate(

        req.params.id,

        {
          status,
          technicianNotes
        },

        {
          new: true,
          runValidators: true
        }

      );


    if (!serviceRequest) {

      return res.status(404).json({

        message:
          "Service request not found"

      });

    }


    res.json({

      message:
        "Service request status updated successfully",

      serviceRequest

    });

  } catch (error) {

    res.status(500).json({

      message:
        "Failed to update service request status",

      error:
        error.message

    });

  }

});


router.put("/:id", async (req, res) => {

  try {

    const serviceRequest =
      await ServiceRequest.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
          runValidators: true
        }

      );


    if (!serviceRequest) {

      return res.status(404).json({

        message:
          "Service request not found"

      });

    }


    res.json({

      message:
        "Service request updated successfully",

      serviceRequest

    });

  } catch (error) {

    res.status(500).json({

      message:
        "Failed to update service request",

      error:
        error.message

    });

  }

});


module.exports = router;