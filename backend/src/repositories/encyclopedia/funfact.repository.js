import { BaseRepository } from '../base.repository.js';
import mongoose from 'mongoose';

// Giả định Model FunFact của bạn tên là 'FunFact', nếu khác hãy điều chỉnh import
const FunFactModel = mongoose.models.FunFact || mongoose.model('FunFact', new mongoose.Schema({}));

export class FunFactRepository extends BaseRepository {
  constructor() {
    super(FunFactModel);
  }

  async getRandomFunFact() {
    const total = await this.countDocuments({});
    if (total === 0) return null;

    const randomIndex = Math.floor(Math.random() * total);
    // Sử dụng cơ chế skip để bốc ngẫu nhiên 1 câu tăng tính tương tác
    const results = await this.model.find({}).skip(randomIndex).limit(1).lean();
    
    return results.length > 0 ? results[0] : null;
  }
}

export const funFactRepository = new FunFactRepository();