import { useState } from "react";

export const useImageAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    setResult(null);
    if (!selectedFile) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Please upload a JPG, PNG, or WEBP image. 🐶");
      return;
    }

    // Limit file size to 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Gọi API Gateway của bạn
      const response = await fetch("http://localhost:5000/api/v1/ai/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to analyze image.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message || "Connection error. Please ensure backend is running.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return {
    file,
    preview,
    isLoading,
    result,
    error,
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleAnalyze,
    handleReset,
  };
};
