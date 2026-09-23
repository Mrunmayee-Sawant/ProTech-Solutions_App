const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

const initialProducts = [
  {
    name: "Godrej SeeThru 7 Pro",
    description: "Smart video door phone system with an indoor monitor and outdoor camera for secure visitor monitoring and two-way communication.",
    category: "Indoor Camera",
    price: 17079,
    stock: 10,
    image: "images/seethru-7-pro.svg",
    status: "Available"
  },
  {
    name: "Godrej SeeThru Contactless Video Door Phone",
    description: "7-inch contactless video door phone with visitor monitoring, two-way audio, night vision, and remote door unlocking.",
    category: "Indoor Camera",
    price: 15999,
    stock: 10,
    image: "images/seethru-7-contactless.svg",
    status: "Available"
  },
  {
    name: "Godrej SeeThru Pro Nova",
    description: "10-inch smart contactless video door phone with Wi-Fi, 2MP camera, visitor monitoring, and two-way communication.",
    category: "Indoor Camera",
    price: 21493,
    stock: 10,
    image: "images/seethru-pro-nova.svg",
    status: "Available"
  },
  {
    name: "Godrej Ace Pro Green (Solar)",
    description: "4MP solar-powered 4G CCTV camera with human detection, two-way audio, night vision, and up to 256GB storage.",
    category: "Outdoor Solar CCTV Camera",
    price: 7000,
    stock: 10,
    image: "images/ace-pro-green-solar.svg",
    status: "Available"
  },
  {
    name: "Godrej Ace Pro 4G Mini PT 3MP",
    description: "3MP 4G Mini PT CCTV camera with pan-tilt movement, human detection, two-way audio, night vision, and remote monitoring.",
    category: "Outdoor CCTV Camera",
    price: 4240,
    stock: 10,
    image: "images/ace-pro-4g-mini-pt.svg",
    status: "Available"
  },
  {
    name: "Godrej Ace Pro 4G Linkage Camera",
    description: "4G wireless linkage CCTV camera with human detection, two-way audio, night vision, and support for up to 256GB storage.",
    category: "Outdoor CCTV Camera",
    price: 3599,
    stock: 10,
    image: "images/ace-pro-4g-linkage.svg",
    status: "Available"
  },
  {
    name: "Godrej Ace Pro Home Camera 3MP",
    description: "Smart Wi-Fi home security camera with 3MP Full HD video, night vision, motion detection, and two-way audio.",
    category: "Indoor CCTV Camera",
    price: 1999,
    stock: 10,
    image: "images/ace-pro-home-camera.svg",
    status: "Available"
  },
  {
    name: "Godrej SeeThru Smart STI-NVR-32S2-4K",
    description: "32-channel 8MP 4K NVR with smart detection, motion alerts, H.265+ compression, and dual SATA storage support.",
    category: "Network Video Recorder (NVR)",
    price: 16799,
    stock: 10,
    image: "images/seethru-smart-nvr.svg",
    status: "Available"
  },
  {
    name: "Godrej SeeThru Smart STI-FD20IR4P-1080PA",
    description: "2MP 1080P dome network IP camera with 3.6mm fixed lens, 20m IR night vision, audio, motion detection, DWDR, PoE, and NVR support.",
    category: "Indoor Dome CCTV Camera",
    price: 2649,
    stock: 10,
    image: "images/seethru-smart-dome.svg",
    status: "Available"
  },
  {
    name: "Godrej SeeThru ST-POE-4P2U",
    description: "4-port PoE switch with 2 uplink ports, 100 Mbps connectivity, 30W per PoE port, and up to 75W total PoE power for CCTV cameras.",
    category: "PoE Network Switch",
    price: 5299,
    stock: 10,
    image: "images/st-poe-4p2u.svg",
    status: "Available"
  },
  {
    name: "1TB Surveillance HDD",
    description: "Surveillance-grade 24x7 internal storage hard disk engineered specifically for continuous CCTV DVR/NVR recording.",
    category: "Storage",
    price: 5000,
    stock: 15,
    image: "images/hdd.svg",
    status: "Available"
  },
  {
    name: "Outdoor CCTV Camera",
    description: "Weather-resistant HD infrared bullet security camera designed for outdoor perimeter surveillance.",
    category: "Outdoor Camera",
    price: 3500,
    stock: 12,
    image: "images/outdoor-camera.svg",
    status: "Available"
  }
];

// Seed products if database collection is empty
async function seedDefaultProductsIfEmpty() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("Seeding default CCTV products into MongoDB Atlas...");
      await Product.insertMany(initialProducts);
      console.log("Products seeded successfully!");
    }
  } catch (err) {
    console.warn("Could not seed products:", err.message);
  }
}

// Trigger initial check
seedDefaultProductsIfEmpty();

/* =====================================================
   GET ALL PRODUCTS
===================================================== */
router.get("/", async (req, res) => {
  try {
    let products = await Product.find().sort({ createdAt: -1 });
    if (products.length === 0) {
      await seedDefaultProductsIfEmpty();
      products = await Product.find().sort({ createdAt: -1 });
    }
    res.status(200).json({
      message: "Products fetched successfully",
      products
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message
    });
  }
});

/* =====================================================
   GET ONE PRODUCT
===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }
    res.status(200).json({
      message: "Product fetched successfully",
      product
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message
    });
  }
});

/* =====================================================
   CREATE PRODUCT
===================================================== */
router.post("/", async (req, res) => {
  try {
    const { name, description, price, category, stock, image, status } = req.body;

    if (!name || !description || !category || price === undefined || price === null || price === "") {
      return res.status(400).json({
        message: "Name, description, category, and valid price are required"
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      stock: Number(stock) || 0,
      image: image ? image.trim() : "images/seethru-smart-dome.svg",
      status: status || (Number(stock) > 0 ? "Available" : "Out of Stock")
    });

    res.status(201).json({
      message: "CCTV product created successfully",
      product
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      message: "Failed to create CCTV product",
      error: error.message
    });
  }
});

/* =====================================================
   UPDATE PRODUCT
===================================================== */
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "CCTV product updated successfully",
      product
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      message: "Failed to update CCTV product",
      error: error.message
    });
  }
});

/* =====================================================
   DELETE PRODUCT
===================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "CCTV product deleted successfully",
      product
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      message: "Failed to delete CCTV product",
      error: error.message
    });
  }
});

module.exports = router;
