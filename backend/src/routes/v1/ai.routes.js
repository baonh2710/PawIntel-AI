import express from 'express';
import { analyzeImage } from '../../controllers/ai/analyze.controller.js';
import {upload} from '../../middlewares/upload.middleware.js';

const aiRouter = express.Router();

// Lưu ý: Endpoint bây giờ chỉ cần '/' vì '/ai' đã được định nghĩa ở index.js
// URL thực tế sẽ là: POST /api/v1/ai/analyze
aiRouter.post('/analyze', upload.single('image'), analyzeImage);

export {aiRouter}