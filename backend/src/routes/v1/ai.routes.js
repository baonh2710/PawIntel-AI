import express from "express";
import { analyzeImage } from "../../controllers/ai/analyze.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { mockAnalyze } from "../../controllers/ai/mock.controller.js";

const aiRouter = express.Router();

// Lưu ý: Endpoint bây giờ chỉ cần '/' vì '/ai' đã được định nghĩa ở index.js
// URL thực tế sẽ là: POST /api/v1/ai/analyze
aiRouter.post("/analyze", upload.single("file"), analyzeImage);
aiRouter.post("/mock-analyze", mockAnalyze);

export { aiRouter };
