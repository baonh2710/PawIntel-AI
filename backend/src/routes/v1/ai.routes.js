import express from "express";
import { upload } from "../../middlewares/upload.middleware.js";
import { analyzeDogPicture } from "../../controllers/ai/analyze.controller.js";

const aiRouter = express.Router();

// Lưu ý: Endpoint bây giờ chỉ cần '/' vì '/ai' đã được định nghĩa ở index.js
// URL thực tế sẽ là: POST /api/v1/ai/analyze
aiRouter.post("/identify", upload.single("file"), analyzeDogPicture);

export { aiRouter };
