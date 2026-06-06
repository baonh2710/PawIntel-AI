import { useState } from "react";

// Component phụ: Thanh phần trăm (Progress Bar) kẹo ngọt
const CuteProgressBar = ({ percent, color = "bg-orange-400" }) => (
  <div className="w-full bg-orange-100 rounded-full h-3.5 mt-2 overflow-hidden shadow-inner">
    <div
      className={`${color} h-3.5 rounded-full transition-all duration-1000 ease-out`}
      style={{ width: `${percent}%` }}
    ></div>
  </div>
);

const ImageAnalyzer = () => {
  // 1. Quản lý trạng thái (State)
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null); // Giờ sẽ chứa { success, message, predictions: [] }
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // 2. Logic Xử lý File
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

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files[0]);
  };

  // Logic Kéo Thả (Drag & Drop)
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

  // 3. Logic Giao tiếp Backend (Fetch API)
  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi từ vũ trụ máy chủ rồi! 🛸");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Render UI
  return (
    <div className="max-w-xl mx-auto p-6 md:p-8 bg-[#fffcf5] rounded-[2rem] shadow-xl border-2 border-orange-100 font-sans text-gray-800">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-orange-600 tracking-tight flex items-center justify-center gap-2">
          <span>🐾</span> Trạm Soi Cún Cưng <span>✨</span>
        </h2>
        <p className="text-orange-400 font-medium mt-2 text-sm">
          Upload ảnh boss lên đây để AI "bắt mạch" xem giống gì nha!
        </p>
      </div>

      {/* Khu vực Upload / Drag & Drop */}
      <div
        className={`relative flex flex-col items-center justify-center p-8 border-4 border-dashed rounded-[1.5rem] transition-all duration-300 ease-in-out ${
          isDragOver
            ? "border-orange-400 bg-orange-50 scale-[1.02]"
            : "border-orange-200 bg-white"
        } hover:border-orange-300 hover:bg-orange-50/50 cursor-pointer shadow-sm`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        {preview ? (
          <div className="relative group w-full flex justify-center">
            <img
              src={preview}
              alt="Preview boss"
              className="h-56 object-cover rounded-2xl shadow-md border-2 border-orange-100 transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/40 rounded-2xl transition-opacity">
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg text-sm">
                Đổi ảnh khác 📸
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-3 animate-bounce">🐕</div>
            <p className="font-bold text-lg text-orange-600">
              Kéo thả ảnh boss vào đây
            </p>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              hoặc chạm để chọn file (Max: 5MB)
            </p>
          </div>
        )}
      </div>

      {/* Hiển thị lỗi file/fetch */}
      {error && (
        <div className="mt-5 p-3 bg-red-50 text-red-500 rounded-xl text-center font-medium border border-red-100 flex items-center justify-center gap-2">
          <span>😿</span> {error}
        </div>
      )}

      {/* Nút Phân tích */}
      <button
        onClick={handleAnalyze}
        disabled={!file || isLoading}
        className={`mt-6 w-full py-4 rounded-2xl font-bold text-lg text-white transition-all duration-200 flex justify-center items-center gap-2 ${
          !file
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : isLoading
              ? "bg-orange-300 cursor-wait shadow-inner"
              : "bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 shadow-md"
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Đang vắt óc soi... 🦴
          </>
        ) : (
          "Soi Cún Ngay! 🔍"
        )}
      </button>

      {/* Khu vực Hiển thị Kết quả từ API */}
      {result && !isLoading && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!result.success ? (
            // Thất bại hoặc ảnh không hợp lệ (độ tin cậy quá thấp)
            <div className="p-5 bg-red-50 border-2 border-red-200 rounded-2xl text-center">
              <div className="text-3xl mb-2">🙈</div>
              <h3 className="font-bold text-red-600 text-lg">Úi chà chà...</h3>
              <p className="text-red-500 mt-1 font-medium">{result.message}</p>
            </div>
          ) : (
            // Thành công
            <div className="bg-white p-5 border-2 border-green-100 shadow-sm rounded-[1.5rem]">
              <div className="text-center mb-5">
                <span className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
                  Tadaa! 🎉 {result.message}
                </span>
              </div>

              {/* Top 1: Highlight to đùng */}
              {result.predictions && result.predictions.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-orange-100 shadow-sm mb-4">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                        Chuẩn nhất (Top 1)
                      </p>
                      <h2 className="text-2xl font-extrabold text-orange-700 mt-1">
                        {result.predictions[0].breed}
                      </h2>
                    </div>
                    <span className="text-xl font-black text-orange-500">
                      {(result.predictions[0].confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <CuteProgressBar
                    percent={(result.predictions[0].confidence * 100).toFixed(
                      1,
                    )}
                    color="bg-orange-500"
                  />
                </div>
              )}

              {/* Top 2 & 3: Flex nhẹ thêm các phương án khác */}
              {result.predictions && result.predictions.length > 1 && (
                <div className="mt-4">
                  <p className="text-sm font-bold text-gray-500 mb-3 ml-1 flex items-center gap-1">
                    <span>🤔</span> Có thể sen nhầm với:
                  </p>
                  <div className="space-y-3">
                    {result.predictions.slice(1).map((item, index) => {
                      const percent = (item.confidence * 100).toFixed(1);
                      return (
                        <div
                          key={index}
                          className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col justify-center"
                        >
                          <div className="flex justify-between items-center text-sm mb-1">
                            <span className="font-semibold text-gray-700">
                              {item.breed}
                            </span>
                            <span className="font-bold text-gray-500">
                              {percent}%
                            </span>
                          </div>
                          <CuteProgressBar
                            percent={percent}
                            color={
                              index === 0 ? "bg-amber-400" : "bg-yellow-400"
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
