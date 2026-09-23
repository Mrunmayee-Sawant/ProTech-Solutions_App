const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Bill = require("../models/Bill");
const Customer = require("../models/Customer");

/* CREATE BILL */
router.post("/", async (req, res) => {
    try {
        const {
            billId,
            customerId,
            billType,
            orderId,
            requestId,
            serviceType,
            serviceCharge,
            gst,
            totalAmount,
            billDate,
            status
        } = req.body;

        if (
            !billId ||
            !customerId ||
            !billType ||
            totalAmount === undefined
        ) {
            return res.status(400).json({
                message: "Please provide all required bill details"
            });
        }

        if (!["Product", "Service"].includes(billType)) {
            return res.status(400).json({
                message: "Invalid bill type"
            });
        }

        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        const existingBill = await Bill.findOne({
            billId: String(billId).trim()
        });

        if (existingBill) {
            return res.status(400).json({
                message: "Bill ID already exists"
            });
        }

        const total = Number(totalAmount);

        if (isNaN(total) || total <= 0) {
            return res.status(400).json({
                message: "Invalid total amount"
            });
        }

        /* SERVICE BILL = ALREADY PAID IN CASH */
        let finalStatus = "Pending";
let isPaid = false;

if (billType === "Service") {
    finalStatus = "Paid";
    isPaid = true;
} else {
    finalStatus = "Pending";
    isPaid = false;
}
        const bill = new Bill({
            billId: String(billId).trim(),

            customerId,

            billType,

            orderId:
                billType === "Product"
                    ? orderId || null
                    : null,

            requestId:
                billType === "Service"
                    ? requestId || null
                    : null,

            serviceType:
                billType === "Service"
                    ? serviceType || null
                    : null,

            serviceCharge:
                billType === "Service"
                    ? Number(serviceCharge || 0)
                    : 0,

            gst:
                Number(gst || 0),

            totalAmount:
                total,

            paidAmount:
                isPaid
                    ? total
                    : 0,

            balanceAmount:
                isPaid
                    ? 0
                    : total,

            billDate:
                billDate
                    ? new Date(billDate)
                    : new Date(),

            status:
                finalStatus
        });

        const savedBill =
            await bill.save();

        res.status(201).json({
            message:
                "Bill created successfully",

            bill:
                savedBill
        });

    } catch (error) {

        console.error(
            "Error creating bill:",
            error
        );

        res.status(500).json({
            message:
                "Error creating bill",

            error:
                error.message
        });
    }
});


/* GET ALL BILLS */
router.get("/", async (req, res) => {
    try {

        const bills =
            await Bill.find()
                .populate(
                    "customerId",
                    "name phone email"
                )
                .populate("orderId")
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            message:
                "Bills fetched successfully",

            bills
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Error fetching bills",

            error:
                error.message
        });
    }
});


/* GET CUSTOMER BILLS */
router.get(
    "/customer/:customerId",
    async (req, res) => {

        try {

            const customerId =
                req.params.customerId;

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

            const bills =
                await Bill.find({
                    customerId:
                        customerId
                })
                    .populate(
                        "customerId",
                        "name phone email"
                    )
                    .populate("orderId")
                    .sort({
                        createdAt: -1
                    });

            res.status(200).json({
                message:
                    "Customer bills fetched successfully",

                bills
            });

        } catch (error) {

            console.error(
                "Error fetching customer bills:",
                error
            );

            res.status(500).json({
                message:
                    "Error fetching customer bills",

                error:
                    error.message
            });
        }
    }
);


/* GET ONE BILL */
router.get("/:id", async (req, res) => {

    try {

        const searchValue =
            req.params.id.trim();

        let bill =
            await Bill.findOne({
                billId:
                    searchValue
            })
                .populate(
                    "customerId",
                    "name phone email"
                )
                .populate("orderId");

        if (
            !bill &&
            mongoose.Types.ObjectId.isValid(
                searchValue
            )
        ) {

            bill =
                await Bill.findById(
                    searchValue
                )
                    .populate(
                        "customerId",
                        "name phone email"
                    )
                    .populate("orderId");
        }

        if (!bill) {

            return res.status(404).json({
                message:
                    "Bill not found"
            });

        }

        res.status(200).json({
            message:
                "Bill fetched successfully",

            bill
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Error fetching bill",

            error:
                error.message
        });
    }
});


/* UPDATE BILL */
router.put("/:id", async (req, res) => {

    try {

        const bill =
            await Bill.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            )
                .populate(
                    "customerId",
                    "name phone email"
                )
                .populate("orderId");

        if (!bill) {

            return res.status(404).json({
                message:
                    "Bill not found"
            });

        }

        res.status(200).json({
            message:
                "Bill updated successfully",

            bill
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Error updating bill",

            error:
                error.message
        });
    }
});


/* DELETE BILL */
router.delete("/:id", async (req, res) => {

    try {

        const bill =
            await Bill.findByIdAndDelete(
                req.params.id
            );

        if (!bill) {

            return res.status(404).json({
                message:
                    "Bill not found"
            });

        }

        res.status(200).json({
            message:
                "Bill deleted successfully",

            bill
        });

    } catch (error) {

        res.status(500).json({
            message:
                "Error deleting bill",

            error:
                error.message
        });
    }
});


module.exports = router;