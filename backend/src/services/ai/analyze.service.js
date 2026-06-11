import axios from 'axios';
import FormData from 'form-data';
import { breedRepository } from '../../repositories/encyclopedia/breed.repository.js';
import { funFactRepository } from '../../repositories/encyclopedia/funfact.repository.js';

export class AnalyzeService {
  static async predictAndPopulateDog(fileBuffer, originalName) {
    const form = new FormData();
    form.append('file', fileBuffer, {
      filename: originalName || 'upload_image.jpg',
      contentType: 'image/jpeg'
    });

    const pythonAiUrl = process.env.PYTHON_AI_SERVICE_URL || 'http://localhost:8000/predict';
    let aiResponseData;

    try {
      const aiResponse = await axios.post(pythonAiUrl, form, {
        headers: { ...form.getHeaders() },
        timeout: 10000
      });
      aiResponseData = aiResponse.data;
    } catch (error) {
      console.error("🔴 [FastAPI Connection Error]:", error.message);
      throw new Error(`AI Prediction Service integration failure: ${error.message}`);
    }

    if (!aiResponseData.success) {
      return { success: false, message: aiResponseData.message || "Không thể nhận diện ảnh.", predictions: [] };
    }

    const aiPredictions = aiResponseData.predictions || [];
    const breedIds = aiPredictions.map(p => p.breed.toLowerCase().trim());

    const [breedsInDb, randomFact] = await Promise.all([
      breedRepository.find({ breedId: { $in: breedIds } }),
      funFactRepository.getRandomFunFact()
    ]);

    const breedDbMap = new Map(breedsInDb.map(b => [b.breedId, b]));

    const populatedPredictions = aiPredictions.map(prediction => {
      const normalizedId = prediction.breed.toLowerCase().trim();
      const dbDetails = breedDbMap.get(normalizedId);

      if (!dbDetails) {
        return {
          breed: prediction.breed,
          confidencePercentage: Math.round(prediction.confidence * 100),
          dbSynced: false
        };
      }

      return {
        breed: dbDetails.name,
        confidencePercentage: Math.round(prediction.confidence * 100),
        dbSynced: true,
        details: dbDetails // Đổ thẳng toàn bộ data (kể cả điểm 1-5) không qua chế biến
      };
    });

    return {
      success: true,
      message: "AI image diagnostics and multi-breed profile mapping successful.",
      analyzedAt: new Date(),
      predictions: populatedPredictions,
      systemFunFact: randomFact ? (randomFact.fact || randomFact.content) : "Dogs have three eyelids, including one that keeps their eyes moist!"
    };
  }
}