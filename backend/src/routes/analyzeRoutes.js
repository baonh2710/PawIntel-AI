import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { analyzeImage } from "../controllers/analyzeController.js";

// Lắp ráp: Khi gọi POST vào gốc route, đi qua trạm kiểm tra file (upload.single), rồi đi vào Controller
const router = express.Router();
router.post("/", upload.single("image"), analyzeImage);

export default router;
