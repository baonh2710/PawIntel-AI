import mongoose from "mongoose";

const dogBreedSchema = new mongoose.Schema(
  {
    breedId: {
      type: String,
      required: true,
      unique: true,
      trim: true, // VD: "golden_retriever" (Must match Python AI output exactly)
    },
    name: {
      type: String,
      required: true,
      trim: true, // VD: "Golden Retriever"
    },
    // BỔ SUNG 1: Đoạn mô tả ngắn giới thiệu giống loài
    description: {
      type: String,
      trim: true,
      default: "",
    },
    // BỔ SUNG 2: Xuất xứ của giống chó
    origin: {
      type: String,
      trim: true,
      default: "Không rõ",
    },
    // BỔ SUNG 3: Ảnh đại diện siêu nhẹ cho trang danh sách (List Page)
    thumbnail: {
      type: String,
      trim: true,
      default: "",
    },
    physicalStats: {
      weight: { type: String, default: "N/A" },
      height: { type: String, default: "N/A" },
      lifespan: { type: String, default: "N/A" },
    },
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
    comparisonMetrics: {
      trainability: { type: Number, required: true, min: 1, max: 5 },
      energyLevel: { type: Number, required: true, min: 1, max: 5 },
      apartmentFriendly: { type: Number, required: true, min: 1, max: 5 },
      kidFriendly: { type: Number, required: true, min: 1, max: 5 },
    },
    coreTraits: [{ type: String, trim: true }],
    careAdvice: [{ type: String, trim: true }],
    sampleImages: [{ type: String, trim: true }], // Chỉ dùng cho Slide/Gallery ở trang chi tiết
    breedSpecificFacts: [{ type: String, trim: true }],
    schemaVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

// TỐI ƯU HÓA ĐÁNH INDEX TEXT: Thêm cả description vào để tìm kiếm thông minh hơn
dogBreedSchema.index({
  name: "text",
  description: "text", // Thêm vào text index
  coreTraits: "text",
  breedSpecificFacts: "text",
});

export const Breed = mongoose.model("DogBreed", dogBreedSchema);
