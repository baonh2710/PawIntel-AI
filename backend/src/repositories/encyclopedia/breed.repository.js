import { BaseRepository } from "../base.repository.js";
import { Breed } from "../../models/encyclopedia/Breed.model.js";

export class BreedRepository extends BaseRepository {
  constructor() {
    super(Breed);
  }

  async findByBreedId(breedId) {
    return await this.findOne({ breedId });
  }

  async searchAndFilterBreeds({
    search,
    size,
    sheddingLevel,
    spaceRequirement,
    barkingLevel,
    weatherTolerance,
    vulnerabilityToDisease,
    energyLevel,
    traits,
    skip,
    limit,
  }) {
    const filter = {};

    if (search) filter.$text = { $search: search };

    // Map các bộ lọc mới
    if (size) filter["lifestyleFilters.size"] = size;
    if (sheddingLevel) filter["lifestyleFilters.sheddingLevel"] = sheddingLevel;
    if (spaceRequirement)
      filter["lifestyleFilters.spaceRequirement"] = spaceRequirement;
    if (barkingLevel) filter["lifestyleFilters.barkingLevel"] = barkingLevel;
    if (weatherTolerance)
      filter["lifestyleFilters.weatherTolerance"] = weatherTolerance;
    if (vulnerabilityToDisease)
      filter["lifestyleFilters.vulnerabilityToDisease"] =
        vulnerabilityToDisease;
    // ... code cũ của bạn
    // [BỔ SUNG V2] Lọc theo chỉ số năng lượng (1-5)
    // Frontend gửi lên dạng: "4,5" (High) hoặc "1,2" (Low)
    if (energyLevel) {
      const levels = energyLevel.split(",").map(Number);
      filter["comparisonMetrics.energyLevel"] = { $in: levels };
    }

    // [BỔ SUNG V2] Lọc theo tính cách (Mảng chuỗi)
    // Frontend gửi lên dạng: "Friendly,Intelligent"
    if (traits) {
      const traitArray = traits.split(",");
      filter["coreTraits"] = { $all: traitArray };
    }

    // Projection...
    // Projection: Loại bỏ các mảng nặng, GIỮ LẠI historySnippet
    const projection = {
      breedId: 1,
      name: 1,
      thumbnail: 1,
      lifestyleFilters: 1,
      comparisonMetrics: 1,
      physicalStats: 1,
      description: 1,
      historySnippet: 1,
    };

    const options = { skip, limit };
    if (search) options.sort = { score: { $meta: "textScore" } };
    else options.sort = { _id: -1 };

    const items = await this.find(filter, projection, options);
    const totalItems = await this.countDocuments(filter);

    return { items, totalItems };
  }
}

export const breedRepository = new BreedRepository();
