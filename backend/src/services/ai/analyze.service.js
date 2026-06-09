import axios from "axios";
import FormData from "form-data";
import { breedRepository } from "../../repositories/encyclopedia/breed.repository.js";
import { funFactRepository } from "../../repositories/encyclopedia/funfact.repository.js";

export class AnalyzeService {
  /**
   * Truyền thông stream sang FastAPI Python, phân tích Top 3 và map dữ liệu chi tiết nuông chiều UI
   * @param {Buffer} fileBuffer - Buffer của ảnh thật từ req.file.buffer
   * @param {string} originalName - Tên file gốc từ client gửi lên
   */
  static async predictAndPopulateDog(fileBuffer, originalName) {
    // 1. Gói FormData gửi binary stream sang FastAPI Python
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
        timeout: 10000, // Giới hạn 10s bảo vệ server
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

    // 2. Chốt chặn Ngưỡng độ tin cậy (Threshold) từ Python AI
    // Nếu Python trả về success: false (độ tin cậy quá thấp), trả thẳng thông tin về cho Frontend render thông báo
    if (!aiResponseData.success) {
      return {
        success: false,
        message:
          aiResponseData.message ||
          "Không thể nhận diện rõ ràng giống chó trong ảnh.",
        predictions: [],
      };
    }

    const aiPredictions = aiResponseData.predictions || []; // Mảng chứa Top 3 dạng: [{breed: "Collie", confidence: 0.85}, ...]

    // Chuẩn hóa toàn bộ danh sách nhãn giống chó thu được về chữ thường (lowercase) để tìm kiếm chính xác trong DB
    const breedIds = aiPredictions.map((p) => 
      p.breed ? p.breed.trim().toLowerCase().replace(/ /g, "_") : ""
    );

    // 3. Thực thi truy vấn đồng thời dữ liệu từ MongoDB để tối ưu tốc độ phản hồi (IO Non-blocking)
    // - Bốc tất cả bản ghi giống chó có breedId nằm trong danh sách Top 3
    // - Bốc ngẫu nhiên một câu FunFact toàn hệ thống tăng tương tác
    const [breedsInDb, randomFact] = await Promise.all([
      breedRepository.find({ breedId: { $in: breedIds } }),
      funFactRepository.getRandomFunFact(),
    ]);

    // Chuyển mảng kết quả DB thành một Map Object để tra cứu O(1) theo breedId khi gộp data
    const breedDbMap = new Map(breedsInDb.map((b) => [b.breedId, b]));

    // 4. Tổ chức gộp cấu trúc dữ liệu mượt mà, bao bọc Top 3 đầy đủ thông tin
    const populatedPredictions = aiPredictions.map((prediction) => {
      const normalizedId = prediction.breed.toLowerCase().trim();
      const dbDetails = breedDbMap.get(normalizedId);

      // Phòng hờ trường hợp AI nhận diện ra nhãn mới nhưng MongoDB chưa kịp seed dữ liệu giống chó đó
      if (!dbDetails) {
        return {
          breed: prediction.breed,
          confidencePercentage: Math.round(prediction.confidence * 100),
          dbSynced: false,
          message:
            "Dữ liệu chi tiết của giống loài này hiện đang được Canis Archive cập nhật.",
        };
      }

      // BUSINESS RULE: Nhân đôi metrics từ thang 1-5 lên thang 1-10 cho từng giống chó được tìm thấy
      const transformedMetrics = dbDetails.comparisonMetrics
        ? {
            trainability: dbDetails.comparisonMetrics.trainability * 2,
            energyLevel: dbDetails.comparisonMetrics.energyLevel * 2,
            apartmentFriendly:
              dbDetails.comparisonMetrics.apartmentFriendly * 2,
            kidFriendly: dbDetails.comparisonMetrics.kidFriendly * 2,
          }
        : null;

      // Trả về cục data hỗn hợp hoàn chỉnh cho loài này
      return {
        breed: dbDetails.name, // Lấy tên hiển thị đẹp trên UI (Ví dụ: "Collie")
        confidencePercentage: Math.round(prediction.confidence * 100),
        dbSynced: true,
        details: {
          ...dbDetails,
          comparisonMetrics: transformedMetrics,
        },
      };
    });

    // 5. Đóng gói Payload tối thượng gửi về cho Frontend cưng nựng UI
    return {
      success: true,
      message:
        "AI image diagnostics and multi-breed profile mapping successful.",
      analyzedAt: new Date(),
      predictions: populatedPredictions, // Mảng Top 3 đã được kích hoạt full profile và x2 điểm
      systemFunFact: randomFact
        ? randomFact.fact || randomFact.content
        : "Dogs have three eyelids, including one that keeps their eyes moist and protected!",
    };
  }
}
