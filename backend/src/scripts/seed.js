import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import DogBreed from "../models/DogBreed.js";
import FunFact from "../models/FunFact.js";

// Load biến môi trường từ file .env
dotenv.config();

// Dữ liệu mẫu cho bảng DogBreeds
const sampleBreeds = [
  {
    breedId: "Chó_Corgi_Pembroke",
    name: "Corgi Pembroke",
    physicalStats: {
      weight: "10 - 14 kg",
      height: "25 - 30 cm",
      lifespan: "12 - 15 năm",
    },
    coreTraits: ["Thông minh", "Năng động", "Bướng bỉnh", "Tình cảm"],
    careAdvice: [
      "Chải lông 2-3 lần/tuần để giảm rụng lông.",
      "Cần vận động đều đặn để tránh béo phì do lưng dài.",
      "Tránh cho leo cầu thang nhiều để bảo vệ cột sống.",
    ],
  },
  {
    breedId: "Chó_Husky_Siberia",
    name: "Husky Siberia",
    physicalStats: {
      weight: "16 - 27 kg",
      height: "50 - 60 cm",
      lifespan: "12 - 14 năm",
    },
    coreTraits: ["Hòa đồng", "Độc lập", "Năng lượng cao", 'Hay "nói chuyện"'],
    careAdvice: [
      "Cần không gian rộng và chạy bộ ít nhất 1-2 tiếng mỗi ngày.",
      "Chải lông thường xuyên, đặc biệt vào mùa thay lông.",
      "Tuyệt đối không cạo lông vì làm mất lớp cách nhiệt tự nhiên.",
    ],
  },
];

// Dữ liệu mẫu cho bảng FunFacts
const sampleFacts = [
  {
    category: "intelligence",
    content:
      "Chó Border Collie được coi là giống chó thông minh nhất thế giới, chúng có thể nhớ hơn 1.000 từ vựng!",
  },
  {
    category: "health",
    content:
      "Mũi của mỗi chú chó có một vân duy nhất, hoàn toàn giống với dấu vân tay của con người.",
  },
  {
    category: "behavior",
    content:
      "Khi cún cưng cuộn tròn lại khi ngủ, đó là bản năng hoang dã để bảo vệ các cơ quan nội tạng và giữ ấm cơ thể.",
  },
];

const importData = async () => {
  try {
    await connectDB();

    // 1. Xóa sạch dữ liệu cũ để tránh trùng lặp
    await DogBreed.deleteMany();
    await FunFact.deleteMany();
    console.log("🧹 Đã dọn dẹp dữ liệu cũ!");

    // 2. Bơm dữ liệu mới
    await DogBreed.insertMany(sampleBreeds);
    await FunFact.insertMany(sampleFacts);
    console.log("🌱 Đã gieo mầm (seed) dữ liệu thành công!");

    // 3. Đóng kết nối
    process.exit();
  } catch (error) {
    console.error(`🔴 Lỗi khi gieo dữ liệu: ${error.message}`);
    process.exit(1);
  }
};

// Chạy hàm
importData();
