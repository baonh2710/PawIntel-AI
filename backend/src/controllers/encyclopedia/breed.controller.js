import { Breed } from "../../models/encyclopedia/Breed.model.js";

// Lấy danh sách giống chó + Hỗ trợ Lọc (Lifestyle Filters) & Tìm kiếm
export const getBreeds = async (req, res) => {
  try {
    const { size, sheddingLevel, spaceRequirement, search } = req.query;
    let query = {};

    // Tính năng: Smart Search (Tìm kiếm theo tên)
    if (search) {
      query.$text = { $search: search };
    }

    // Tính năng: Lifestyle Filters
    if (size) query["lifestyleFilters.size"] = size;
    if (sheddingLevel) query["lifestyleFilters.sheddingLevel"] = sheddingLevel;
    if (spaceRequirement)
      query["lifestyleFilters.spaceRequirement"] = spaceRequirement;

    const breeds = await Breed.find(query).select("-__v");

    res.status(200).json({
      success: true,
      count: breeds.length,
      data: breeds,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error: " + error.message });
  }
};

// Hồ sơ chi tiết (Magazine-style Deep Dive)
export const getBreedById = async (req, res) => {
  try {
    const { id } = req.params;
    const breed = await Breed.findOne({ breedId: id }).select("-__v");

    if (!breed) {
      return res
        .status(404)
        .json({ success: false, message: "Breed not found" });
    }

    res.status(200).json({
      success: true,
      data: breed,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error: " + error.message });
  }
};

// Bàn cân thú cưng (Breed Comparison)
export const compareBreeds = async (req, res) => {
  try {
    const { breed1, breed2 } = req.query;

    if (!breed1 || !breed2) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please provide two breedIds to compare",
        });
    }

    const breeds = await Breed.find({
      breedId: { $in: [breed1, breed2] },
    }).select("breedId name comparisonMetrics physicalStats sampleImages");

    if (breeds.length !== 2) {
      return res
        .status(404)
        .json({
          success: false,
          message: "One or both breeds not found in database",
        });
    }

    res.status(200).json({
      success: true,
      data: {
        breed1: breeds.find((b) => b.breedId === breed1),
        breed2: breeds.find((b) => b.breedId === breed2),
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error: " + error.message });
  }
};
