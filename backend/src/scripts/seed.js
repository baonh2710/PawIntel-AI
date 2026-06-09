import mongoose from "mongoose";
import dotenv from "dotenv";
import { Breed } from "../models/encyclopedia/Breed.model.js";

dotenv.config();

const mockBreeds = [
  {
    breedId: "golden_retriever",
    name: "Golden Retriever",
    // Ví dụ khi bổ sung vào file seed:
    description: "Giống chó thông minh, trung thành...",
    origin: "Scotland",
    thumbnail: "https://link-anh-thumbnail.jpg",
    physicalStats: {
      weight: "25-34 kg",
      height: "55-61 cm",
      lifespan: "10-12 years",
    },
    lifestyleFilters: {
      size: "Large",
      sheddingLevel: "High",
      spaceRequirement: "Large Yard",
    },
    comparisonMetrics: {
      trainability: 5,
      energyLevel: 4,
      apartmentFriendly: 2,
      kidFriendly: 5,
    },
    coreTraits: ["Friendly", "Loyal", "Intelligent"],
    careAdvice: [
      "Requires 1-2 hours of vigorous daily exercise. Loves swimming and fetch.",
      "Dense double coat requires brushing 2-3x per week. Heavy seasonal shedding.",
    ],
    sampleImages: [
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800",
    ],
    breedSpecificFacts: [
      "Golden Retrievers were originally bred in Scotland in the 1800s for retrieving waterfowl.",
    ],
  },
  {
    breedId: "welsh_corgi_pembroke",
    name: "Welsh Corgi Pembroke",
    // Ví dụ khi bổ sung vào file seed:
    description: "Giống chó thông minh, trung thành...",
    origin: "Scotland",
    thumbnail: "https://link-anh-thumbnail.jpg",
    physicalStats: {
      weight: "10-14 kg",
      height: "25-30 cm",
      lifespan: "12-15 years",
    },
    lifestyleFilters: {
      size: "Small",
      sheddingLevel: "High",
      spaceRequirement: "Small Yard",
    },
    comparisonMetrics: {
      trainability: 4,
      energyLevel: 4,
      apartmentFriendly: 3,
      kidFriendly: 4,
    },
    coreTraits: ["Affectionate", "Alert", "Smart"],
    careAdvice: [
      "Prone to weight gain. Monitor diet closely and provide daily moderate walks.",
      "Regular brushing needed to manage thick weather-resistant double coat.",
    ],
    sampleImages: [
      "https://images.unsplash.com/photo-1612536057832-2ff7eed58194?w=800",
    ],
    breedSpecificFacts: [
      "According to Welsh legend, fairies used Pembroke Welsh Corgis to pull their coaches.",
    ],
  },
];

const seedDB = async () => {
  try {
    // Đảm bảo bạn đã cấu hình MONGO_URI trong file .env
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to MongoDB for seeding...");

    // Dọn sạch data cũ để tránh trùng lặp
    await Breed.deleteMany({});
    console.log("🗑️ Cleaned existing breed records.");

    // Bơm data mới
    await Breed.insertMany(mockBreeds);
    console.log("✅ Successfully seeded real dog breeds into Database!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
