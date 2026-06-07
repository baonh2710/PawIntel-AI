import { predictDogBreed } from "../services/aiService.js";

export const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Không tìm thấy file ảnh trong request." });
    }

    console.log(
      `[Gateway] Nhận được ảnh: ${req.file.originalname} (${req.file.size} bytes)`,
    );
    console.log(`[Gateway] Đang chuyển tiếp sang AI Microservice...`);

    // Gọi Service thực thi nghiệp vụ lõi
    const result = await predictDogBreed(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
    );

    console.log(`[Gateway] Nhận kết quả thành công, trả về Frontend.`);
    return res.status(200).json(result);
  } catch (error) {
    console.error("[Gateway Error]:", error.message);
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
};
