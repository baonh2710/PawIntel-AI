import { AnalyzeService } from "../../services/ai/analyze.service.js";

export const analyzeDogPicture = async (req, res) => {
  try {
    // Kiểm tra chốt chặn nếu người dùng không upload file ảnh lên qua FormData
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Multipart Request Error: No binary file found under the form-data key 'file'.",
      });
    }

    // Gửi buffer ảnh thật sang tầng Service xử lý tích hợp liên tầng
    const integrationResult = await AnalyzeService.predictAndPopulateDog(
      req.file.buffer,
      req.file.originalname,
    );

    return res.status(200).json({
      success: true,
      message: "AI image diagnostics mapping completely successful.",
      data: integrationResult,
    });
  } catch (error) {
    console.error("🔴 [Analyze Controller Core Error]:", error.message);

    // Tách biệt lỗi do sync data hoặc kết nối để trả mã phù hợp
    const statusCode = error.message.includes("Data Sync Error")
      ? { code: 422 }
      : { code: 500 };

    return res.status(statusCode.code).json({
      success: false,
      message: `AI Pipeline Diagnostic Failure: ${error.message}`,
    });
  }
};
