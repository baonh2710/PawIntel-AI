import axios from "axios";
import FormData from "form-data";
import { breedRepository } from "../../repositories/encyclopedia/breed.repository.js";
import { FunFactService } from "../encyclopedia/funfact.service.js";

export class AnalyzeService {
  /**
   * Truyền thông stream sang FastAPI Python, phân tích Top 3 và map dữ liệu chi tiết từ MongoDB
   * Đã loại bỏ logic nhân đôi điểm (*2), giữ nguyên thang 1-5 gốc từ DB
   */
  static async predictAndPopulateDog(fileBuffer, originalName) {
    const form = new FormData();
    form.append("file", fileBuffer, {
      filename: originalName || "upload_image.jpg",
      contentType: "image/jpeg",
    });

    const pythonAiUrl =
      process.env.PYTHON_AI_SERVICE_URL || "http://localhost:8000/predict";
    let aiResponseData;

    try {
      const aiResponse = await axios.post(pythonAiUrl, form, {
        headers: { ...form.getHeaders() },
        timeout: 10000,
      });
      aiResponseData = aiResponse.data;
    } catch (error) {
      console.error(
        "🔴 [FastAPI Connection Error]: Không thể kết nối Service Python AI.",
        error.message,
      );
      throw new Error(
        `AI Prediction Service integration failure: ${error.message}`,
      );
    }

    if (!aiResponseData.success) {
      return {
        success: false,
        message: aiResponseData.message || "Không thể nhận diện ảnh.",
        predictions: [],
      };
    }

    const aiPredictions = aiResponseData.predictions || [];

    // Chuẩn hóa nhãn Python (Ví dụ: "Border Collie" -> "border_collie") để quét chuẩn trong MongoDB
    const breedIds = aiPredictions.map((p) =>
      p.breed.toLowerCase().trim().replace(/\s+/g, "_"),
    );

    // Truy vấn đồng thời giống chó trong danh sách và bốc ngẫu nhiên 1 câu FunFact
    const [breedsInDb, randomFact] = await Promise.all([
      breedRepository.find({ breedId: { $in: breedIds } }),
      FunFactService.getRandomArchivalFact(),
    ]);

    // Tạo Map Object với key chuẩn hóa để tra cứu O(1)
    const breedDbMap = new Map(breedsInDb.map((b) => [b.breedId, b]));

    // Gộp dữ liệu AI với thông tin chi tiết từ Database
    const populatedPredictions = aiPredictions.map((prediction) => {
      // Ép định dạng ID đồng nhất với Map Key ("Rough Collie" -> "rough_collie")
      const normalizedId = prediction.breed
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_");
      const dbDetails = breedDbMap.get(normalizedId);

      if (!dbDetails) {
        return {
          breed: prediction.breed,
          confidencePercentage: Math.round(prediction.confidence * 100),
          dbSynced: false,
        };
      }

      return {
        breed: dbDetails.name, // Lấy tên hiển thị đẹp (Ví dụ: "Collie")
        confidencePercentage: Math.round(prediction.confidence * 100),
        dbSynced: true,
        details: dbDetails, // Giữ nguyên thang điểm 1-5 nguyên bản từ DB đổ về
      };
    });

    return {
      success: true,
      message:
        "AI image diagnostics and multi-breed profile mapping successful.",
      analyzedAt: new Date(),
      predictions: populatedPredictions,
      systemFunFact: randomFact
        ? randomFact
        : "Dogs have three eyelids, including one that keeps their eyes moist and protected!",
    };
  }
}
