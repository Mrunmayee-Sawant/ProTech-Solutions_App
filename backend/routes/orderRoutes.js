const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Product = require("../models/Product");

const router = express.Router();

/* ============================================================
   CREATE ORDER
   POST /api/orders
============================================================ */
router.post("/", async (req, res) => {
  try {
    console.log("========================================");
    console.log("CREATE ORDER REQUEST");
    console.log("BODY:", req.body);
    console.log("========================================");

    /*
     * ==========================================================
     * GET CUSTOMER ID
     * ==========================================================
     */
    const customerId =
      req.body.customerId ||
      req.body.customer ||
      null;

    if (
      !customerId ||
      !mongoose.Types.ObjectId.isValid(
        String(customerId)
      )
    ) {
      return res.status(400).json({
        message: "Valid Customer ID is required"
      });
    }

    /*
     * ==========================================================
     * GET PAYMENT METHOD
     * ==========================================================
     */
    const paymentMethod =
      req.body.paymentMethod || "Cash";

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

    /*
     * ==========================================================
     * FIND CUSTOMER
     * ==========================================================
     */
    const customerData =
      await Customer.findById(customerId);

    if (!customerData) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }

    /*
     * ==========================================================
     * GET ORDER ITEMS
     * ==========================================================
     */
    let items = [];

    if (
      Array.isArray(req.body.items) &&
      req.body.items.length > 0
    ) {
      items = req.body.items;
    } else {

      const productId =
        req.body.product ||
        req.body.productId ||
        null;

      const quantity =
        Number(
          req.body.quantity || 1
        );

      items = [
        {
          productId: productId,
          quantity: quantity
        }
      ];
    }

    /*
     * ==========================================================
     * VALIDATE ITEMS
     * ==========================================================
     */
    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message:
          "At least one product is required"
      });
    }

    /*
     * ==========================================================
     * VALIDATE ALL PRODUCT IDS FIRST
     * ==========================================================
     */
    for (
      const item of items
    ) {

      const productId =
        item.productId ||
        item.product ||
        item._id ||
        item.id ||
        null;

      if (
        !productId ||
        !mongoose.Types.ObjectId.isValid(
          String(productId)
        )
      ) {
        return res.status(400).json({
          message:
            "Valid Product ID is required"
        });
      }

      const quantity =
        Number(
          item.quantity || 1
        );

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          message:
            "Quantity must be at least 1"
        });
      }
    }

    /*
     * ==========================================================
     * LOAD PRODUCTS AND CHECK STOCK
     * ==========================================================
     */
    const productDetails = [];

    for (
      const item of items
    ) {

      const productId =
        item.productId ||
        item.product ||
        item._id ||
        item.id;

      const quantity =
        Number(
          item.quantity || 1
        );

      const productData =
        await Product.findById(
          productId
        );

      if (!productData) {
        return res.status(404).json({
          message:
            `Product not found: ${productId}`
        });
      }

      const availableStock =
        Number(
          productData.stock || 0
        );

      if (
        availableStock < quantity
      ) {
        return res.status(400).json({
          message:
            `${productData.name || "Product"} does not have enough stock`,
          availableStock:
            availableStock,
          requestedQuantity:
            quantity
        });
      }

      const price =
        Number(
          productData.price || 0
        );

      productDetails.push({
        productData:
          productData,

        productId:
          productData._id,

        quantity:
          quantity,

        price:
          price,

        total:
          price * quantity
      });
    }

    /*
     * ==========================================================
     * CALCULATE TOTAL
     * ==========================================================
     */
    let totalAmount = 0;

    for (
      const item of productDetails
    ) {

      totalAmount +=
        item.total;
    }

    /*
     * ==========================================================
     * CREATE ORDERS
     * ==========================================================
     */
    const createdOrders = [];

    for (
      const item of productDetails
    ) {

      const order =
        await Order.create({

          customer:
            customerData._id,

          product:
            item.productId,

          quantity:
            item.quantity,

          price:
            item.price,

          totalAmount:
            item.total,

          paymentMethod:
            paymentMethod
        });

      createdOrders.push(
        order
      );

      /*
       * ========================================================
       * REDUCE PRODUCT STOCK
       * ========================================================
       */
      item.productData.stock =
        Number(
          item.productData.stock || 0
        ) -
        item.quantity;

      if (
        item.productData.stock <= 0
      ) {

        item.productData.stock =
          0;

        item.productData.status =
          "Out of Stock";

      } else {

        item.productData.status =
          "Available";
      }

      await item.productData.save();
    }

    /*
     * ==========================================================
     * POPULATE CREATED ORDERS
     * ==========================================================
     */
    const populatedOrders = [];

    for (
      const createdOrder
      of createdOrders
    ) {

      const populatedOrder =
        await Order.findById(
          createdOrder._id
        )
          .populate(
            "customer",
            "-password"
          )
          .populate(
            "product"
          );

      populatedOrders.push(
        populatedOrder
      );
    }

    /*
     * ==========================================================
     * PRIMARY ORDER
     * ==========================================================
     */
    const primaryOrder =
      populatedOrders[0];

    console.log(
      "ORDER CREATED SUCCESSFULLY:",
      populatedOrders
    );

    /*
     * ==========================================================
     * SUCCESS RESPONSE
     * ==========================================================
     */
    return res.status(201).json({

      success:
        true,

      message:
        "Order placed successfully!",

      order:
        primaryOrder,

      orders:
        populatedOrders,

      orderId:
        primaryOrder
          ? primaryOrder._id
          : null,

      totalAmount:
        totalAmount,

      customerId:
        customerData._id,

      paymentMethod:
        paymentMethod
    });

  } catch (error) {

    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({

      success:
        false,

      message:
        "Failed to create order",

      error:
        error.message
    });
  }
});


/* ============================================================
   GET ORDERS FOR ONE CUSTOMER
   GET /api/orders/customer/:customerId
============================================================ */
router.get(
  "/customer/:customerId",
  async (req, res) => {

    try {

      const {
        customerId
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          customerId
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid customer ID"
        });
      }

      const orders =
        await Order.find({
          customer:
            customerId
        })
          .populate(
            "product"
          )
          .sort({
            createdAt:
              -1
          });

      return res.status(200).json({

        success:
          true,

        message:
          "Customer orders fetched successfully",

        orders:
          orders
      });

    } catch (error) {

      console.error(
        "Get customer orders error:",
        error
      );

      return res.status(500).json({

        success:
          false,

        message:
          "Failed to fetch customer orders",

        error:
          error.message
      });
    }
  }
);


/* ============================================================
   GET ALL ORDERS
   GET /api/orders
============================================================ */
router.get(
  "/",
  async (req, res) => {

    try {

      const orders =
        await Order.find()
          .populate(
            "customer",
            "-password"
          )
          .populate(
            "product"
          )
          .sort({
            createdAt:
              -1
          });

      return res.status(200).json({

        success:
          true,

        message:
          "Orders fetched successfully",

        orders:
          orders
      });

    } catch (error) {

      console.error(
        "Get orders error:",
        error
      );

      return res.status(500).json({

        success:
          false,

        message:
          "Failed to fetch orders",

        error:
          error.message
      });
    }
  }
);


/* ============================================================
   GET SINGLE ORDER
   GET /api/orders/:id
============================================================ */
router.get(
  "/:id",
  async (req, res) => {

    try {

      const {
        id
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid order ID"
        });
      }

      const order =
        await Order.findById(
          id
        )
          .populate(
            "customer",
            "-password"
          )
          .populate(
            "product"
          );

      if (!order) {

        return res.status(404).json({
          message:
            "Order not found"
        });
      }

      return res.status(200).json({

        success:
          true,

        message:
          "Order fetched successfully",

        order:
          order
      });

    } catch (error) {

      console.error(
        "Get single order error:",
        error
      );

      return res.status(500).json({

        success:
          false,

        message:
          "Failed to fetch order",

        error:
          error.message
      });
    }
  }
);


/* ============================================================
   UPDATE ORDER STATUS
   PUT /api/orders/:id
============================================================ */
router.put(
  "/:id",
  async (req, res) => {

    try {

      const {
        id
      } = req.params;

      const {
        status
      } = req.body;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid order ID"
        });
      }

      if (!status) {

        return res.status(400).json({
          message:
            "Order status is required"
        });
      }

      const order =
        await Order.findByIdAndUpdate(

          id,

          {
            status:
              status
          },

          {
            new:
              true,

            runValidators:
              true
          }

        )
          .populate(
            "customer",
            "-password"
          )
          .populate(
            "product"
          );

      if (!order) {

        return res.status(404).json({
          message:
            "Order not found"
        });
      }

      return res.status(200).json({

        success:
          true,

        message:
          "Order status updated successfully",

        order:
          order
      });

    } catch (error) {

      console.error(
        "Update order error:",
        error
      );

      return res.status(500).json({

        success:
          false,

        message:
          "Failed to update order",

        error:
          error.message
      });
    }
  }
);


/* ============================================================
   DELETE ORDER
   DELETE /api/orders/:id
============================================================ */
router.delete(
  "/:id",
  async (req, res) => {

    try {

      const {
        id
      } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid order ID"
        });
      }

      const order =
        await Order.findByIdAndDelete(
          id
        );

      if (!order) {

        return res.status(404).json({
          message:
            "Order not found"
        });
      }

      return res.status(200).json({

        success:
          true,

        message:
          "Order deleted successfully",

        order:
          order
      });

    } catch (error) {

      console.error(
        "Delete order error:",
        error
      );

      return res.status(500).json({

        success:
          false,

        message:
          "Failed to delete order",

        error:
          error.message
      });
    }
  }
);


module.exports = router;