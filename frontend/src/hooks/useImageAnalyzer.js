// src/hooks/useImageAnalyzer.js
import {useState} from "react";
import {analyzeDogImage} from "../services/analyzerService"; // Import file service bạn vừa tạo!

export const useImageAnalyzer = () => {
  // --- 1. STATE MANAGEMENT ---
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // --- 2. LOGIC XỬ LÝ FILE ---
  const validateAndSetFile = (selectedFile) => {
    setError(null);
    setResult(null);

    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Chỉ nhận ảnh JPG, PNG, WEBP thui nha sen ơi! 😿");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Ảnh bự quá (Max 5MB), sen nén lại tí nha! 🐕");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // --- 3. CÁC HÀM TƯƠNG TÁC (HANDLERS) ---
  const handleFileChange = (e) => validateAndSetFile(e.target.files[0]);
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  // --- 4. LOGIC GỌI API ---
  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    try {
      // Gọi hàm từ service, code cực kỳ ngắn gọn!
      const data = await analyzeDogImage(file);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 5. TRẢ VỀ NHỮNG GÌ UI CẦN ---
  return {
    file,
    preview,
    isLoading,
    result,
    error,
    isDragOver,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleAnalyze,
  };
};

