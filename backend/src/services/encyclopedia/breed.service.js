// src/services/encyclopedia/breed.service.js
import { breedRepository } from "../../repositories/encyclopedia/breed.repository.js";

export class BreedService {
  static async getAllBreeds(queryParams) {
    const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
    const limit = Math.max(1, parseInt(queryParams.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const { search, size, sheddingLevel, spaceRequirement } = queryParams;

    // Gọi đúng thực thể (instance) đã được import phía trên
    const { items, totalItems } = await breedRepository.searchAndFilterBreeds({
      search,
      size,
      sheddingLevel,
      spaceRequirement,
      skip,
      limit,
    });

    // BUSINESS RULE: Nhân đôi metrics lên thang 1-10 để UI ProgressBar render chuẩn tỉ lệ %
    const transformedItems = items.map((item) =>
      this.#mapBreedMetricsToUi(item),
    );
    const totalPages = Math.ceil(totalItems / limit);

    return {
      breeds: transformedItems,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  static async getBreedDetails(breedId) {
    const breed = await breedRepository.findByBreedId(breedId);
    if (!breed) return null;

    // BUSINESS RULE: Nhân đôi metrics trang chi tiết
    return this.#mapBreedMetricsToUi(breed);
  }

  // Hàm bộ trợ transform thang điểm an toàn
  static #mapBreedMetricsToUi(breedObject) {
    if (!breedObject.comparisonMetrics) return breedObject;

    return {
      ...breedObject,
      comparisonMetrics: {
        trainability: breedObject.comparisonMetrics.trainability * 2,
        energyLevel: breedObject.comparisonMetrics.energyLevel * 2,
        apartmentFriendly: breedObject.comparisonMetrics.apartmentFriendly * 2,
        kidFriendly: breedObject.comparisonMetrics.kidFriendly * 2,
      },
    };
  }
}
