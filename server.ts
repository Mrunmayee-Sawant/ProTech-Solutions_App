import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { createRequire } from "module";

dotenv.config();

const require = createRequire(__filename);

const customerRoutes = require("./backend/routes/customerRoutes.js");
const staffRoutes = require("./backend/routes/staffRoutes.js");
const orderRoutes = require("./backend/routes/orderRoutes.js");
const cctvRoutes = require("./backend/routes/cctvRoutes.js");
const serviceRoutes = require("./backend/routes/serviceRoutes.js");
const serviceRequestRoutes = require("./backend/routes/serviceRequestRoutes.js");
const paymentRoutes = require("./backend/routes/paymentRoutes.js");
const billRoutes = require("./backend/routes/billRoutes.js");
const productRoutes = require("./backend/routes/productRoutes.js");

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Serve static assets from project root and images directory
  app.use("/images", express.static(path.join(process.cwd(), "images")));
  app.use("/public", express.static(path.join(process.cwd(), "public")));

  // API Routes FIRST
  app.use("/api/customers", customerRoutes);
  app.use("/api/staff", staffRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/cctv", cctvRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/service-requests", serviceRequestRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/bills", billRoutes);
  app.use("/api/products", productRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      timestamp: new Date().toISOString()
    });
  });

  // Redirect root to Login.html
  app.get("/", (req, res) => {
    res.redirect("/Login.html");
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.use(express.static(process.cwd()));
    app.get("*", (req, res) => {
      res.redirect("/Login.html");
    });
  }

  // Connect to MongoDB Atlas
  const mongoUri = process.env.MONGO_URI || "mongodb+srv://sawantmrunmayee2_db_user:vTI6gfuWlvUXlal5@cluster0.mttcc78.mongodb.net/?appName=Cluster0";

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas successfully for ProTech Solutions!");
  } catch (err: any) {
    console.error("MongoDB Atlas connection error:", err.message);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ProTech Solutions Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server startup error:", err);
});