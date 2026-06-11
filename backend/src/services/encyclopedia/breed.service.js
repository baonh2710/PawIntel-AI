import { breedRepository } from "../../repositories/encyclopedia/breed.repository.js";

export class BreedService {
  static async getAllBreeds(queryParams) {
    const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
    const limit = Math.max(1, parseInt(queryParams.limit, 10) || 6);
    const skip = (page - 1) * limit;

    const {
      search,
      size,
      sheddingLevel,
      spaceRequirement,
      barkingLevel,
      weatherTolerance,
      vulnerabilityToDisease,
    } = queryParams;

    const { items, totalItems } = await breedRepository.searchAndFilterBreeds({
      search,
      size,
      sheddingLevel,
      spaceRequirement,
      barkingLevel,
      weatherTolerance,
      vulnerabilityToDisease,
      skip,
      limit,
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      breeds: items, // Trả thẳng dữ liệu gốc (1-5) về cho UI
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
    return breed; // Trả thẳng dữ liệu gốc (1-5) về cho UI
  }
}
