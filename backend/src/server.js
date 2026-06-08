import "dotenv/config";
import express from "express";
import cors from "cors";
import { v1Router } from "./routes/v1/index.js"; // Import đích danh

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// Gắn toàn bộ version 1 vào /api/v1
app.use("/api/v1", v1Router);

app.listen(PORT, () => {
  console.log(
    `🚀 Gateway Server (ES Modules) đang chạy tại: http://localhost:${PORT}`,
  );
});
