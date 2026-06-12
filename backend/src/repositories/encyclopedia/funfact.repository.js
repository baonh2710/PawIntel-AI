import { BaseRepository } from "../base.repository.js";
import { FunFact } from "../../models/encyclopedia/FunFact.model.js";

export class FunFactRepository extends BaseRepository {
  constructor() {
    super(FunFact);
  }

  async getRandomFact() {
    // Sử dụng $sample để lấy ngẫu nhiên 1 bản ghi với hiệu suất O(1)
    const randomFacts = await this.model.aggregate([{ $sample: { size: 1 } }]);

    // Aggregate trả về mảng, ta lấy phần tử đầu tiên nếu có
    return randomFacts.length > 0 ? randomFacts[0] : null;
  }
}

export const funFactRepository = new FunFactRepository();
