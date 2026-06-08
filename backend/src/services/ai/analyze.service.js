import axios from "axios";
import FormData from "form-data";
import { breedRepository } from "../../repositories/encyclopedia/breed.repository.js";
import { FunFact } from "../../models/encyclopedia/FunFact.model.js";

/**
 * Gửi file ảnh sang Python AI Microservice để phân tích
 * Sau đó lấy kết quả để tra cứu thông tin chi tiết từ Database
 */
export const predictDogBreed = async (fileBuffer, originalName, mimeType) => {
  const formData = new FormData();

  formData.append("file", fileBuffer, {
    filename: originalName,
    contentType: mimeType,
  });

  const pythonApiUrl =
    process.env.PYTHON_API_URL || "http://localhost:8000/predict";

  // 1. Gửi ảnh sang Python AI
  const response = await axios.post(pythonApiUrl, formData, {
    headers: {
      ...formData.getHeaders(),
    },
  });

  const aiResult = response.data;

  // 2. Xử lý logic nếu AI không nhận diện được (API Python trả về lỗi hoặc success: false)
  if (!aiResult.success) {
    return {
      success: false,
      ai_analysis: aiResult,
      encyclopedia: null,
      fun_fact: null,
      message: aiResult.message || "Failed to analyze image.",
    };
  }

  // 3. Trích xuất giống chó Top 1 từ AI và gọi xuống Database
  const topMatch =
    aiResult.predictions && aiResult.predictions.length > 0
      ? aiResult.predictions[0]
      : null;

  if (!topMatch) {
    return {
      success: false,
      ai_analysis: aiResult,
      encyclopedia: null,
      fun_fact: null,
      message: "AI did not return any valid predictions.",
    };
  }

  const breedIdFromAI = topMatch.breed;
  let breedDetails = null;

  if (breedIdFromAI) {
    breedDetails = await breedRepository.findByBreedId(breedIdFromAI);
  }

  // 4. Bốc ngẫu nhiên 1 câu Fun Fact từ DB cho giao diện thêm sinh động
  const totalFacts = await FunFact.countDocuments();
  let randomFact = null;
  if (totalFacts > 0) {
    const randomIndex = Math.floor(Math.random() * totalFacts);
    randomFact = await FunFact.findOne().skip(randomIndex).lean();
  }

  // 5. Gom chung dữ liệu của AI, Database và Fun Fact để trả về Frontend
  return {
    success: true,
    ai_analysis: aiResult,
    top_prediction_info: {
      breed_id: breedIdFromAI,
      confidence: topMatch.confidence,
    },
    encyclopedia: breedDetails,
    fun_fact: randomFact,
    message: breedDetails
      ? "Analysis completed and breed insights retrieved successfully."
      : `Analysis completed for '${breedIdFromAI}', but no encyclopedia data was found.`,
  };
};
