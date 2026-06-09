import express from "express";
import {
  getBreeds,
  getBreedById,
  compareBreeds,
} from "../../controllers/encyclopedia/breed.controller.js";

const encyclopediaRouter = express.Router();

// Route 1: Bàn cân thú cưng (VD: /api/v1/encyclopedia/compare?breed1=corgi&breed2=golden)
// Phải đặt route này lên trước /:id để tránh xung đột params
encyclopediaRouter.get("/compare", compareBreeds);

// Route 2: Lấy danh sách & Lọc (VD: /api/v1/encyclopedia?size=Small)
encyclopediaRouter.get("/", getBreeds);

// Route 3: Xem chi tiết 1 giống (VD: /api/v1/encyclopedia/golden_retriever)
encyclopediaRouter.get("/:id", getBreedById);

export { encyclopediaRouter };
