import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js'; // Đảm bảo hàm kết nối MongoDB của bạn đã gọi ở đây
import { v1Router } from './routes/v1/index.js';

dotenv.config();
connectDB()

const app = express();
const PORT = process.env.PORT || 5000; // Khóa chặt cổng 5000 backend của bạn

app.use(cors({ origin: 'http://localhost:5173' })); // Cho phép Frontend cổng 5173 gọi lên
app.use(express.json());

// Tích hợp luồng Route trung tâm chuẩn Enterprise
app.use('/api/v1', v1Router);

app.listen(PORT, () => {
  console.log(`🚀 Gateway Server (ES Modules) đang chạy mượt mà tại trạm: http://localhost:${PORT}`);
});