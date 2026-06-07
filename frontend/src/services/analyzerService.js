// src/services/analyzerService.js

/**
 * Hàm gửi ảnh lên backend Node.js để phân tích
 * @param {File} file - File ảnh người dùng upload
 * @returns {Promise<Object>} - Trả về dữ liệu JSON chứa predictions
 */
export const analyzeDogImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("http://localhost:3000/api/analyze", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  
  if (!response.ok) {
    // Bắn lỗi ra để Frontend (Hook) tự bắt và hiển thị
    throw new Error(data.error || "Có lỗi từ vũ trụ máy chủ rồi! 🛸");
  }

  return data;
};
