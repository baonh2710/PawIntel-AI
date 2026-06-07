import axios from "axios";
import FormData from "form-data";

/**
 * Gửi file ảnh sang Python AI Microservice để phân tích
 */
export const predictDogBreed = async (fileBuffer, originalName, mimeType) => {
  const formData = new FormData();

  formData.append("file", fileBuffer, {
    filename: originalName,
    contentType: mimeType,
  });

  // Tốt nhất nên cấu hình biến môi trường, tạm thời để fix cứng fallback
  const pythonApiUrl =
    process.env.PYTHON_API_URL || "http://localhost:8000/predict";

  const response = await axios.post(pythonApiUrl, formData, {
    headers: {
      ...formData.getHeaders(),
    },
  });

  return response.data;
};
