import mongoose from "mongoose";

const dogBreedSchema = new mongoose.Schema(
  {
    breedId: {
      type: String,
      required: true,
      unique: true,
      trim: true, // VD: "golden_retriever", "welsh_corgi_pembroke"
    },
    name: {
      type: String,
      required: true,
      trim: true, // Tên hiển thị trên UI: "Golden Retriever"
    },
    // 1. Phục vụ hiển thị thông tin cơ bản & Hồ sơ tạp chí
    physicalStats: {
      weight: { type: String, default: "N/A" },
      height: { type: String, default: "N/A" },
      lifespan: { type: String, default: "N/A" },
    },
    // 2. Các trường định tính phục vụ Bộ lọc thông minh (Lifestyle Filters)
    lifestyleFilters: {
      size: {
        type: String,
        required: true,
        enum: ["Small", "Medium", "Large"],
      },
      sheddingLevel: {
        type: String,
        required: true,
        enum: ["Low", "Medium", "High"],
      },
      spaceRequirement: {
        type: String,
        required: true,
        enum: ["Apartment", "Small Yard", "Large Yard"],
      },
    },
    // 3. Điểm số định lượng (1-5) phục vụ thanh "CuteProgressBar" khi So sánh giống chó
    comparisonMetrics: {
      trainability: { type: Number, required: true, min: 1, max: 5 },
      energyLevel: { type: Number, required: true, min: 1, max: 5 },
      apartmentFriendly: { type: Number, required: true, min: 1, max: 5 },
      kidFriendly: { type: Number, required: true, min: 1, max: 5 },
    },
    // 4. Phục vụ hiển thị Tag trực quan & Lời khuyên
    coreTraits: [
      {
        type: String,
        trim: true,
      },
    ],
    careAdvice: [
      {
        type: String,
        trim: true,
      },
    ],
    sampleImages: [
      {
        type: String,
        trim: true,
      },
    ],
    // 5. Fun Facts đặc thù của riêng giống loài đó
    breedSpecificFacts: [
      {
        type: String,
        trim: true,
      },
    ],
    schemaVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

// Sử dụng Named Export
export const Breed = mongoose.model("DogBreed", dogBreedSchema);
