import { BreedService } from "../../services/encyclopedia/breed.service.js";

export const getBreedsList = async (req, res) => {
  try {
    const data = await BreedService.getAllBreeds(req.query);
    return res.status(200).json({
      success: true,
      message: "Paginated breeds collection fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("🔴 [Breed Controller List Error]:", error.message);
    return res.status(500).json({
      success: false,
      message: `System failure handling encyclopedia list stream: ${error.message}`,
    });
  }
};

export const getBreedProfile = async (req, res) => {
  try {
    const { breedId } = req.params;
    const breedDetails = await BreedService.getBreedDetails(breedId);

    // Bẫy lỗi 404 chặt chẽ cho trang chi tiết tạp chí
    if (!breedDetails) {
      return res.status(404).json({
        success: false,
        message: `Profile Reference Error: Canine breed entry with code identity '${breedId}' was not found in the Canis Archive.`,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Canine high-fidelity magazine profile document fetched successfully.",
      data: breedDetails,
    });
  } catch (error) {
    console.error("🔴 [Breed Controller Profile Error]:", error.message);
    return res.status(500).json({
      success: false,
      message: `System failure parsing specific profile sheet sequence: ${error.message}`,
    });
  }
};
