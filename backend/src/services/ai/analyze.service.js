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

  // 5. [REFACTOR] Khớp nối & Chuẩn hóa cấu trúc Dữ liệu để nuông chiều UI
  const otherMatchesFormatted = (aiResult.predictions || [])
    .slice(1, 4) // Lấy tối đa 3 giống chó xếp sau để đưa vào mục "Other Possible Matches"
    .map((p) => ({
      breed: p.breed
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "), // Corgi_pembroke -> Corgi Pembroke
      confidence: Math.round(p.confidence * 100), // Đổi từ hệ thập phân (0.85) sang phần trăm (85%)
    }));

  const uiFormattedData = {
    topMatch: {
      breed: breedDetails ? breedDetails.name : breedIdFromAI,
      confidence: Math.round(topMatch.confidence * 100), // Đổi sang % để ném vào Badge tròn
    },
    otherMatches: otherMatchesFormatted,
    encyclopedia: breedDetails
      ? {
          name: breedDetails.name,
          scientificName: `Canis lupus familiaris • Origin: ${breedDetails.origin || "Unknown"}`,
          primaryImage:
            breedDetails.sampleImages?.[0] ||
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800",
          coreTraits: breedDetails.coreTraits || [],
          physicalStats: breedDetails.physicalStats || {
            weight: "N/A",
            height: "N/A",
            lifespan: "N/A",
          },
          // Nhân 2 điểm số từ thang 1-5 trong DB lên thang 1-10 để thanh Progress Bar hiển thị chuẩn tỉ lệ
          comparisonMetrics: {
            energyLevel: (breedDetails.comparisonMetrics?.energyLevel || 3) * 2,
            sociability: (breedDetails.comparisonMetrics?.kidFriendly || 3) * 2, // Map tạm độ thân thiện
            trainability:
              (breedDetails.comparisonMetrics?.trainability || 3) * 2,
            guarding:
              (breedDetails.comparisonMetrics?.apartmentFriendly || 3) * 2,
          },
          story:
            breedDetails.description ||
            breedDetails.breedSpecificFacts?.[0] ||
            "No overview available.",
          tags: [
            breedDetails.lifestyleFilters?.size,
            `${breedDetails.lifestyleFilters?.sheddingLevel} Shedding`,
            breedDetails.lifestyleFilters?.spaceRequirement,
          ].filter(Boolean),
          careAdvice: (breedDetails.careAdvice || []).map((advice, index) => ({
            title: index === 0 ? "Exercise Needs" : "Grooming & Upkeep",
            desc: advice,
          })),
        }
      : null,
    funFact: randomFact
      ? randomFact.content
      : breedDetails?.breedSpecificFacts?.[0] ||
        "Dogs are human's best friends.",
  };

  return {
    success: true,
    data: uiFormattedData, // Đóng gói toàn bộ cục data mượt mà này gửi về cho Controller
    message: breedDetails
      ? "Analysis completed and breed insights retrieved successfully."
      : `Analysis completed for '${breedIdFromAI}', but no encyclopedia data was found.`,
  };
};
