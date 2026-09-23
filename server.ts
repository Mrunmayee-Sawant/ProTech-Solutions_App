import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

import customerRoutes from "./backend/routes/customerRoutes.js";
import staffRoutes from "./backend/routes/staffRoutes.js";
import orderRoutes from "./backend/routes/orderRoutes.js";
import cctvRoutes from "./backend/routes/cctvRoutes.js";
import serviceRoutes from "./backend/routes/serviceRoutes.js";
import serviceRequestRoutes from "./backend/routes/serviceRequestRoutes.js";
import paymentRoutes from "./backend/routes/paymentRoutes.js";
import billRoutes from "./backend/routes/billRoutes.js";
import productRoutes from "./backend/routes/productRoutes.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json());

  app.use("/images", express.static(path.join(process.cwd(), "images")));
  app.use("/public", express.static(path.join(process.cwd(), "public")));

  app.use("/api/customers", customerRoutes);
  app.use("/api/staff", staffRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/cctv", cctvRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/service-requests", serviceRequestRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/bills", billRoutes);
  app.use("/api/products", productRoutes);

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      timestamp: new Date().toISOString()
    });
  });

  app.get("/", (req, res) => {
    res.redirect("/Login.html");
  });

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

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MONGO_URI is not set.");
  } else {
    try {
      await mongoose.connect(mongoUri);
      console.log("Connected to MongoDB Atlas successfully for ProTech Solutions!");
    } catch (err: any) {
      console.error("MongoDB Atlas connection error:", err.message);
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ProTech Solutions Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server startup error:", err);
});