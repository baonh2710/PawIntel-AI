import { Breed } from "../../models/encyclopedia/Breed.model.js";

export const mockAnalyze = async (req, res) => {
  try {
    // 1. Giữ nguyên 1.5s delay để Frontend chạy hiệu ứng xoay Loading
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 2. Query ngẫu nhiên 1 tài liệu giống chó từ MongoDB
    const randomBreeds = await Breed.aggregate([{ $sample: { size: 1 } }]);

    if (!randomBreeds || randomBreeds.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No breeds found in database. Please run the seed script first.",
      });
    }

    const dbBreed = randomBreeds[0];

    // 3. Đóng gói chuẩn cấu trúc dữ liệu để gửi trả về Frontend
    res.status(200).json({
      success: true,
      data: {
        topMatch: {
          breed: dbBreed.name,
          confidence: Math.floor(Math.random() * 10) + 90, // Tạo độ tự tin ngẫu nhiên 90-99%
        },
        otherMatches: [
          {
            breed: "Labrador Retriever",
            confidence: 5,
            image:
              "https://images.unsplash.com/photo-1591769225440-811ad7d6eab1?w=100&h=100&fit=crop",
          },
        ],
        encyclopedia: {
          name: dbBreed.name,
          scientificName: `Canis lupus familiaris • Size: ${dbBreed.lifestyleFilters.size}`,
          primaryImage:
            dbBreed.sampleImages[0] ||
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800",
          coreTraits: dbBreed.coreTraits,
          physicalStats: dbBreed.physicalStats,
          // Nhân 2 điểm số từ thang 1-5 trong DB lên thang 1-10 để thanh Progress Bar hiển thị chuẩn tỉ lệ
          comparisonMetrics: {
            energyLevel: dbBreed.comparisonMetrics.energyLevel * 2,
            sociability: 10, // Mock tạm trường này nếu UI cần cứng
            trainability: dbBreed.comparisonMetrics.trainability * 2,
            guarding: dbBreed.comparisonMetrics.apartmentFriendly * 2, // Dùng tạm điểm thích nghi căn hộ làm guarding
          },
          story:
            dbBreed.breedSpecificFacts[0] ||
            "A fascinating breed with rich historical background and exceptional capabilities.",
          tags: [
            dbBreed.lifestyleFilters.size,
            `${dbBreed.lifestyleFilters.sheddingLevel} Shedding`,
            dbBreed.lifestyleFilters.spaceRequirement,
          ],
          careAdvice: dbBreed.careAdvice.map((advice, index) => ({
            title: index === 0 ? "Daily Guidelines" : "Grooming & Upkeep",
            desc: advice,
          })),
        },
        funFact:
          dbBreed.breedSpecificFacts[0] ||
          "Dogs can understand up to 250 words and gestures.",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database query failed: " + error.message,
    });
  }
};
