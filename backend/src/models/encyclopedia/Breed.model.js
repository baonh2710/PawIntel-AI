import mongoose from "mongoose";

const dogBreedSchema = new mongoose.Schema(
  {
    breedId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    origin: { type: String, trim: true, default: "Unknown" },
    thumbnail: { type: String, trim: true, default: "" },
    historySnippet: { type: String, trim: true, default: "" }, // [MỚI V2] Giai thoại lịch sử

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
      barkingLevel: {
        type: String,
        required: true,
        enum: ["Quiet", "Moderate", "Vocal"],
      }, // [MỚI V2]
      weatherTolerance: {
        type: String,
        required: true,
        enum: ["Cold Only", "Hot Only", "Adaptable"],
      }, // [MỚI V2]
      vulnerabilityToDisease: {
        type: String,
        required: true,
        enum: ["Hardy", "Moderate", "Delicate"],
      }, // [MỚI V2]
    },

    comparisonMetrics: {
      trainability: { type: Number, required: true, min: 1, max: 5 },
      energyLevel: { type: Number, required: true, min: 1, max: 5 },
      apartmentFriendly: { type: Number, required: true, min: 1, max: 5 },
      kidFriendly: { type: Number, required: true, min: 1, max: 5 },
      aloneTolerance: { type: Number, required: true, min: 1, max: 5 }, // [MỚI V2]
      petFriendly: { type: Number, required: true, min: 1, max: 5 }, // [MỚI V2]
    },

    healthRisks: [{ type: String, trim: true }], // [MỚI V2] Cảnh báo sức khỏe
    coreTraits: [{ type: String, trim: true }],
    careAdvice: [{ type: String, trim: true }],
    sampleImages: [{ type: String, trim: true }],
    breedSpecificFacts: [{ type: String, trim: true }],
    schemaVersion: { type: Number, default: 2 },
  },
  { timestamps: true },
);

// Kích hoạt cụm Text Index (Bao gồm cả historySnippet)
dogBreedSchema.index({
  name: "text",
  description: "text",
  coreTraits: "text",
  breedSpecificFacts: "text",
  historySnippet: "text",
});

export const Breed = mongoose.model("DogBreed", dogBreedSchema);
