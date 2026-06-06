const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. GLOBAL MIDDLEWARE
// ==========================================
// Cấu hình CORS cực kỳ quan trọng để Trạm 1 (React) ở cổng khác có thể gọi được Trạm 2
app.use(cors({ origin: "http://localhost:5173" })); // Đổi port nếu Frontend Vite của bạn chạy port khác
app.use(express.json());

// ==========================================
// 2. CẤU HÌNH UPLOAD (MULTER)
// ==========================================
// Dùng MemoryStorage để hứng file vào RAM, tránh việc phải quản lý/xóa file thủ công trong ổ cứng
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB đồng bộ với quy tắc của Frontend
  },
});

// ==========================================
// 3. MAIN ROUTER - KẾT NỐI VỚI AI MICROSERVICE
// ==========================================
app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    // Kiểm tra xem Frontend có gửi file lên không
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Không tìm thấy file ảnh trong request." });
    }

    console.log(
      `[Gateway] Nhận được ảnh: ${req.file.originalname} (${req.file.size} bytes)`,
    );

    // Khởi tạo FormData nội bộ của Node.js để đóng gói lại file
    const formData = new FormData();

    // req.file.buffer chính là dữ liệu ảnh dạng raw đang nằm trong RAM
    formData.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // Bắn FormData sang Trạm 3 (Python/FastAPI)
    // Giả sử FastAPI đang chạy ở localhost:8000
    const pythonApiUrl = "http://localhost:8000/predict";

    console.log(`[Gateway] Đang chuyển tiếp sang AI Microservice...`);
    const pythonResponse = await axios.post(pythonApiUrl, formData, {
      // Phải đính kèm headers đặc biệt của thư viện form-data để FastAPI hiểu
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Nhận kết quả từ Python và trả thẳng về cho Frontend
    console.log(`[Gateway] Nhận kết quả thành công, trả về Frontend.`);
    res.status(200).json(pythonResponse.data);
  } catch (error) {
    // Xử lý nếu Python sập hoặc trả về lỗi 400/422/500
    const statusCode = error.response ? error.response.status : 500;
    const errorMsg = error.response
      ? error.response.data.detail
      : "Lỗi kết nối đến trạm AI";

    return res.status(statusCode).json({
      success: false,
      predictions: [],
      message: errorMsg,
    });
  }
});

// ==========================================
// 4. KHỞI ĐỘNG SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Gateway Server đang chạy tại: http://localhost:${PORT}`);
});
