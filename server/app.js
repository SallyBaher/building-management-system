import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import setupRoutes from "./routes/setupRoutes.js";
import floorRoutes from "./routes/floorRoutes.js";
import buildingRoutes from "./routes/buildingRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Building Management System API is running"
  });
});

app.use("/auth", authRoutes);
app.use("/setup", setupRoutes);
app.use("/floors", floorRoutes);
app.use("/building", buildingRoutes);
app.put("/test-update-route", (req, res) => {
  res.json({
    message: "PUT route is working"
  });
});
app.use(notFound);
app.use(errorHandler);

export default app;
