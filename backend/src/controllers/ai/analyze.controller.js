import { predictDogBreed } from "../../services/ai/analyze.service.js";

export const analyzeImage = async (req, res) => {
  try {
    // 1. Kiểm tra xem có file tải lên không
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No image file provided. Please upload an image." 
      });
    }

    // 2. Chuyển file xuống tầng Service để xử lý (Gọi Python + Query DB)
    const result = await predictDogBreed(
      req.file.buffer, 
      req.file.originalname, 
      req.file.mimetype
    );

    // 3. Trả về cho React
    return res.status(200).json(result);
    
  } catch (error) {
    console.error("🔴 [Analyze Controller Error]:", error.message);
    
    // Đảm bảo luôn trả về JSON để Frontend không bị lỗi "Unexpected token < or I"
    return res.status(500).json({ 
      success: false, 
      message: `System Error: ${error.message}. (Did you forget to start the Python AI Server?)` 
    });
  }
};