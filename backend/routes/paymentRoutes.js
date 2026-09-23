const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Payment = require("../models/Payment");
const Bill = require("../models/Bill");
const Customer = require("../models/Customer");
const Order = require("../models/Order");


/* =====================================================
   TEST PAYMENT ROUTE
   GET /api/payments/test
===================================================== */
router.get("/test", (req, res) => {
  res.json({
    message: "Payment routes are working!"
  });
});


/* =====================================================
   GET ALL PAYMENTS
   GET /api/payments
===================================================== */
router.get("/", async (req, res) => {
  try {

    const payments = await Payment.find()
      .populate("customerId", "name phone email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Payments fetched successfully",
      payments
    });

  } catch (error) {

    console.error("Error fetching payments:", error);

    res.status(500).json({
      message: "Error fetching payments",
      error: error.message
    });
  }
});


/* =====================================================
   GET PAYMENTS FOR ONE CUSTOMER
   GET /api/payments/customer/:customerId
===================================================== */
router.get("/customer/:customerId", async (req, res) => {
  try {

    const { customerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).json({
        message: "Invalid customer ID"
      });
    }

    const payments = await Payment.find({
      customerId: customerId
    })
      .populate("customerId", "name phone email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Customer payments fetched successfully",
      payments
    });

  } catch (error) {

    console.error(
      "Error fetching customer payments:",
      error
    );

    res.status(500).json({
      message: "Error fetching customer payments",
      error: error.message
    });
  }
});


/* =====================================================
   GET ONE PAYMENT
   GET /api/payments/:id
===================================================== */
router.get("/:id", async (req, res) => {
  try {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid payment ID"
      });
    }

    const payment = await Payment.findById(id)
      .populate("customerId", "name phone email");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found"
      });
    }

    res.status(200).json({
      message: "Payment fetched successfully",
      payment
    });

  } catch (error) {

    console.error(
      "Error fetching payment:",
      error
    );

    res.status(500).json({
      message: "Error fetching payment",
      error: error.message
    });
  }
});


/* =====================================================
   CONFIRM PAYMENT
   POST /api/payments
===================================================== */
router.post("/", async (req, res) => {

  try {

    console.log("====================================");
    console.log("PAYMENT REQUEST RECEIVED");
    console.log("PAYMENT DATA:", req.body);
    console.log("====================================");


    const customerId =
      req.body.customerId;

    const orderId =
      req.body.orderId || null;

    const billId =
      req.body.billId || null;

    const amount =
      req.body.amount;

    const method =
      req.body.paymentMethod ||
      req.body.method;

    const reference =
      req.body.reference ||
      req.body.remarks ||
      orderId ||
      billId ||
      "";

    const status =
      req.body.status ||
      "Paid";


    /* =================================================
       CUSTOMER VALIDATION
    ================================================= */

    if (
      !customerId ||
      !mongoose.Types.ObjectId.isValid(customerId)
    ) {

      return res.status(400).json({
        message: "Valid Customer ID is required"
      });
    }


    /* =================================================
       AMOUNT VALIDATION
    ================================================= */

    const paymentAmount =
      Number(amount);

    if (
      amount === undefined ||
      amount === null ||
      isNaN(paymentAmount) ||
      paymentAmount <= 0
    ) {

      return res.status(400).json({
        message: "Valid payment amount is required"
      });
    }


    /* =================================================
       PAYMENT METHOD VALIDATION
    ================================================= */

    if (
      !method ||
      String(method).trim() === ""
    ) {

      return res.status(400).json({
        message: "Payment method is required"
      });
    }

    const paymentMethod =
      String(method).trim();


    if (
      ![
        "UPI",
        "Card",
        "NetBanking",
        "Cash"
      ].includes(paymentMethod)
    ) {

      return res.status(400).json({
        message: "Invalid payment method"
      });
    }


    /* =================================================
       CHECK CUSTOMER
    ================================================= */

    const customer =
      await Customer.findById(customerId);

    if (!customer) {

      return res.status(404).json({
        message: "Customer not found"
      });
    }


    /* =================================================
       CHECK ORDER
    ================================================= */

    let order = null;

    if (orderId) {

      if (
        !mongoose.Types.ObjectId.isValid(orderId)
      ) {

        return res.status(400).json({
          message: "Invalid order ID"
        });
      }

      order =
        await Order.findById(orderId);

      if (!order) {

        return res.status(404).json({
          message: "Order not found"
        });
      }

      /* -----------------------------------------------
         CHECK CUSTOMER FIELD
         Supports both customer and customerId
      ------------------------------------------------ */

      const orderCustomerId =
        order.customerId ||
        order.customer;

      if (
        !orderCustomerId ||
        String(orderCustomerId) !==
        String(customerId)
      ) {

        return res.status(400).json({
          message:
            "Order does not belong to this customer"
        });
      }
    }


    /* =================================================
       CHECK BILL
    ================================================= */

    let bill = null;

    if (billId) {

      bill =
        await Bill.findOne({
          billId: String(billId).trim()
        });

      /*
         Product payments may happen before a bill
         is generated, so a missing bill is allowed.
      */
    }


    /* =================================================
       CREATE PAYMENT DATA
    ================================================= */

    const paymentData = {

      customerId: customerId,

      amount: paymentAmount,

      method: paymentMethod,

      date: new Date(),

      reference: String(reference),

      status: status

    };


    /* -----------------------------------------------
       ADD BILL ID ONLY IF BILL EXISTS
    ------------------------------------------------ */

    if (bill) {

      paymentData.billId =
        String(bill.billId);
    }


    /* -----------------------------------------------
       ADD ORDER ID FOR PRODUCT PAYMENT
    ------------------------------------------------ */

    if (order) {

      paymentData.orderId =
        order._id;
    }


    /* =================================================
       SAVE PAYMENT
    ================================================= */

    console.log(
      "PAYMENT DATA BEING SAVED:",
      paymentData
    );

    const payment =
      new Payment(paymentData);

    const savedPayment =
      await payment.save();


    /* =================================================
       UPDATE ORDER PAYMENT METHOD
    ================================================= */

    if (order) {

      order.paymentMethod =
        paymentMethod;

      await order.save();

      console.log(
        "ORDER PAYMENT METHOD UPDATED:",
        paymentMethod
      );
    }


    /* =================================================
       UPDATE BILL
       Only when an actual bill exists
    ================================================= */

    if (bill) {

      const paidAmount =
        Number(bill.paidAmount || 0) +
        paymentAmount;

      const totalAmount =
        Number(bill.totalAmount || 0);

      bill.paidAmount =
        paidAmount;

      bill.balanceAmount =
        Math.max(
          0,
          totalAmount - paidAmount
        );


      if (bill.balanceAmount <= 0) {

        bill.status = "Paid";

      } else {

        bill.status =
          "Partially Paid";
      }


      await bill.save();
    }


    /* =================================================
       POPULATE PAYMENT
    ================================================= */

    const populatedPayment =
      await Payment.findById(
        savedPayment._id
      ).populate(
        "customerId",
        "name phone email"
      );


    /* =================================================
       SUCCESS RESPONSE
    ================================================= */

    console.log(
      "PAYMENT SUCCESS:",
      populatedPayment
    );


    res.status(201).json({

      message:
        "Payment recorded successfully",

      payment:
        populatedPayment,

      bill:
        bill

    });

  } catch (error) {

    console.error(
      "===================================="
    );

    console.error(
      "PAYMENT CREATION ERROR:",
      error
    );

    console.error(
      "===================================="
    );


    res.status(500).json({

      message:
        "Error confirming payment",

      error:
        error.message

    });
  }
});


/* =====================================================
   UPDATE PAYMENT
   PUT /api/payments/:id
===================================================== */
router.put("/:id", async (req, res) => {

  try {

    const { id } =
      req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        message: "Invalid payment ID"
      });
    }


    const payment =
      await Payment.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      )
      .populate(
        "customerId",
        "name phone email"
      );


    if (!payment) {

      return res.status(404).json({
        message: "Payment not found"
      });
    }


    res.status(200).json({

      message:
        "Payment updated successfully",

      payment

    });

  } catch (error) {

    console.error(
      "Error updating payment:",
      error
    );

    res.status(500).json({

      message:
        "Error updating payment",

      error:
        error.message

    });
  }
});


/* =====================================================
   DELETE PAYMENT
   DELETE /api/payments/:id
===================================================== */
router.delete("/:id", async (req, res) => {

  try {

    const { id } =
      req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        message: "Invalid payment ID"
      });
    }


    const payment =
      await Payment.findByIdAndDelete(id);


    if (!payment) {

      return res.status(404).json({
        message: "Payment not found"
      });
    }


    res.status(200).json({

      message:
        "Payment deleted successfully",

      payment

    });

  } catch (error) {

    console.error(
      "Error deleting payment:",
      error
    );

    res.status(500).json({

      message:
        "Error deleting payment",

      error:
        error.message

    });
  }
});


module.exports = router;