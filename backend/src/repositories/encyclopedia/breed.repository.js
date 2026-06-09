import { BaseRepository } from '../base.repository.js';
import { Breed } from '../../models/encyclopedia/Breed.model.js';

class BreedRepository extends BaseRepository {
  constructor() {
    super(Breed);
  }

  async findByBreedId(breedId) {
    return await this.findOne({ breedId });
  }

  async searchAndFilterBreeds({ search, size, sheddingLevel, spaceRequirement, skip, limit }) {
    const filter = {};

    // 1. Smart Search sử dụng toán tử $text của MongoDB
    if (search) {
      filter.$text = { $search: search };
    }

    // 2. Bộ lọc kết hợp đồng thời (Lifestyle Filters)
    if (size) {
      filter['lifestyleFilters.size'] = size;
    }
    if (sheddingLevel) {
      filter['lifestyleFilters.sheddingLevel'] = sheddingLevel;
    }
    if (spaceRequirement) {
      filter['lifestyleFilters.spaceRequirement'] = spaceRequirement;
    }

    // 3. Projection tối ưu băng thông: loại bỏ các mảng cực nặng (careAdvice, sampleImages)
    const projection = {
      breedId: 1,
      name: 1,
      thumbnail: 1,
      lifestyleFilters: 1,
      comparisonMetrics: 1,
      physicalStats: 1,
      description: 1
    };

    // 4. Phân bổ Options và sắp xếp theo độ liên quan nếu có search keyword
    const options = { skip, limit };
    if (search) {
      options.sort = { score: { $meta: 'textScore' } };
    } else {
      options.sort = { createdAt: -1 };
    }

    const items = await this.find(filter, projection, options);
    const totalItems = await this.countDocuments(filter);

    return { items, totalItems };
  }
}

// Thực thi Named Export instance bảo vệ hệ thống
export const breedRepository = new BreedRepository();