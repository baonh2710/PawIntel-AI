import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import { Breed } from "../models/encyclopedia/Breed.model.js";
import { FunFact } from "../models/encyclopedia/FunFact.model.js";

const breedsMockData = [
  {
    breedId: "golden_retriever",
    name: "Golden Retriever",
    physicalStats: {
      weight: "25 - 34 kg",
      height: "51 - 61 cm",
      lifespan: "10 - 12 years",
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
    coreTraits: ["Friendly", "Devoted", "Intelligent", "Eager to please"],
    careAdvice: [
      "Requires at least 1-2 hours of daily physical exercise to expend energy.",
      "The dense double coat needs thorough brushing 2-3 times a week to manage shedding.",
      "Highly social and deeply attached to owners; should not be left alone for long periods to prevent separation anxiety.",
    ],
    sampleImages: [
      "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=600",
    ],
    breedSpecificFacts: [
      "Goldens are often used as guide dogs due to their intelligence and gentle temperament.",
      'They have a "soft mouth", meaning they can carry an object like an egg without damaging it.',
    ],
  },
  {
    breedId: "welsh_corgi_pembroke",
    name: "Welsh Corgi Pembroke",
    physicalStats: {
      weight: "10 - 14 kg",
      height: "25 - 30 cm",
      lifespan: "12 - 15 years",
    },
    lifestyleFilters: {
      size: "Medium",
      sheddingLevel: "High",
      spaceRequirement: "Apartment",
    },
    comparisonMetrics: {
      trainability: 4,
      energyLevel: 4,
      apartmentFriendly: 4,
      kidFriendly: 4,
    },
    coreTraits: ["Affectionate", "Alert", "Smart", "Energetic", "Stubborn"],
    careAdvice: [
      "Strict portion control is mandatory; this breed is highly prone to obesity.",
      "Minimize frequent stair climbing or jumping from high surfaces to protect their long spinal structure.",
      "Possesses strong herding instincts (may nip heels); early socialization and training are highly recommended.",
    ],
    sampleImages: [
      "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?q=80&w=600",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600",
    ],
    breedSpecificFacts: [
      "According to Welsh legend, fairies used Pembroke Welsh Corgis to pull their coaches and herd their cattle.",
      "Queen Elizabeth II owned more than 30 Corgis during her reign.",
    ],
  },
];

const funFactsMockData = [
  {
    category: "intelligence",
    content:
      "The Border Collie is widely recognized as the smartest dog breed in the world. A famous Collie named Chaser could identify and recall the names of over 1,000 distinct toys.",
  },
  {
    category: "health",
    content:
      "Just like human fingerprints are completely unique, a dog’s nose print has a distinctive pattern of ridges and creases. In some countries, nose prints are legally used to identify lost pets.",
  },
  {
    category: "behavior",
    content:
      "When dogs curl up into a tight ball while sleeping, they are acting on a primitive survival instinct. This position not only conserves body heat but also protects their vital internal organs from predators.",
  },
  {
    category: "history",
    content:
      "Three dogs miraculously survived the tragic sinking of the Titanic in 1912. All of them were small breeds (two Pomeranians and one Pekingese) wrapped snugly in blankets by their owners to board lifeboats.",
  },
];

const seedDatabase = async () => {
  try {
    // Kết nối đến MongoDB
    await connectDB();

    console.log("🧹 Clearing old encyclopedia data...");
    // Xóa sạch dữ liệu cũ để tránh trùng lặp khi chạy nhiều lần
    await Breed.deleteMany({});
    await FunFact.deleteMany({});

    console.log("🌱 Seeding English Dog Breeds with Advanced Metrics...");
    // Chèn dữ liệu giống chó
    await Breed.insertMany(breedsMockData);

    console.log("🌱 Seeding English Fun Facts...");
    // Chèn dữ liệu Fun Facts
    await FunFact.insertMany(funFactsMockData);

    console.log("🟢 [Seeder] Database populated successfully in English!");
    process.exit(0);
  } catch (error) {
    console.error(`🔴 [Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

// Chạy hàm seed
seedDatabase();
