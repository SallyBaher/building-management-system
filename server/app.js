import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import setupRoutes from "./routes/setupRoutes.js";
import floorRoutes from "./routes/floorRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/setup", setupRoutes);
app.use("/floors", floorRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Building Management System API is running"
  });
});

export default app;
