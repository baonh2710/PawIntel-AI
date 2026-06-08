import { BaseRepository } from "../base.repository.js"; // Named import thằng cha
import { Breed } from "../../models/encyclopedia/Breed.model.js"; // Named import model giống chó của bạn

class BreedRepository extends BaseRepository {
  constructor() {
    // Bơm trực tiếp Model Breed vào cho BaseRepository xử lý các hàm chung (findOne, findAll, create...)
    super(Breed);
  }

  // Hàm đặc thù riêng của giống chó
  async findByBreedId(breedId) {
    return await this.findOne({ breedId });
  }
}

// Xuất ra dưới dạng Named Export để tầng Service import chuẩn xác
export const breedRepository = new BreedRepository();
