// src/server.js
import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyzeRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/analyze", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Gateway Server (ES Modules) đang chạy tại: http://localhost:${PORT}`);
});