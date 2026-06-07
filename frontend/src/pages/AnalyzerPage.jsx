// src/pages/AnalyzerPage.jsx
import {useImageAnalyzer}  from "../hooks/useImageAnalyzer";
import {CuteProgressBar} from "../components/common/CuteProgressBar";
import { AdviceCard } from "@/components/common/AdviceCard";

export const AnalyzerPage = () => {
  // --- KẾT NỐI VỚI NÃO BỘ (HOOK) ---
  const {
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
  } = useImageAnalyzer();

  // --- MẶT TIỀN (UI) KHÔNG CHỨA LOGIC PHỨC TẠP ---
  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-800 font-sans p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* ================= CỘT TRÁI: UPLOAD & TIPS ================= */}
        <div className="lg:col-span-5 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <span>🐾</span> Trạm Soi Cún
            </h1>
            <p className="text-gray-500 font-medium mt-3 text-sm md:text-base leading-relaxed">
              Tải ảnh lên hoặc kéo thả vào khung bên dưới. Hệ thống sẽ "nhìn
              ngắm" diện mạo của bé và dự đoán giống chó giúp bạn!
            </p>
          </div>

          {/* Khung Upload */}
          <div
            className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-[2.5rem] transition-all duration-300 ease-out ${
              isDragOver
                ? "border-rose-400 bg-rose-50 scale-[1.02]"
                : "border-gray-200 bg-white hover:border-rose-300 hover:bg-rose-50/30 hover:shadow-xl hover:shadow-rose-100/50"
            } cursor-pointer group`}
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
              <div className="relative w-full flex justify-center">
                <img
                  src={preview}
                  alt="Preview boss"
                  className="h-64 object-cover w-full rounded-[2rem] shadow-sm transition-transform duration-500 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/30 backdrop-blur-sm rounded-[2rem] transition-all duration-300">
                  <span className="bg-gray-900 text-white px-5 py-2.5 rounded-full font-semibold shadow-xl text-sm transform translate-y-2 group-hover:translate-y-0 transition-all">
                    Chạm để đổi ảnh khác 📸
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                  🐕
                </div>
                <p className="font-bold text-lg text-gray-700">
                  Kéo thả ảnh vào đây
                </p>
                <p className="text-sm text-gray-400 mt-2 font-medium">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
          </div>

          {/* Button Phân Tích */}
          <button
            onClick={handleAnalyze}
            disabled={!file || isLoading}
            className={`w-full py-4 rounded-[2rem] font-bold text-lg transition-all duration-300 flex justify-center items-center gap-3 ${
              !file
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isLoading
                  ? "bg-rose-200 text-rose-600 cursor-wait shadow-inner"
                  : "bg-rose-500 text-white hover:bg-rose-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-200 active:translate-y-0"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
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
                Hệ thống đang quan sát...
              </>
            ) : (
              "Bắt đầu phân tích ✨"
            )}
          </button>

          {/* Hiển thị lỗi file */}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-3xl text-sm font-semibold flex items-center gap-3">
              <span className="text-xl">😿</span> {error}
            </div>
          )}

          {/* GÓC NHẮC NHỞ (Tips) */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
              <span>💡</span> Bí kíp soi chuẩn
            </h3>
            <AdviceCard
              icon="📸"
              title="Góc chụp quyết định"
              text="Một số góc chụp khuất, lóa sáng hoặc quá xa khiến AI dễ bị 'hoa mắt'. Sen thử chọn ảnh chụp trực diện khuôn mặt bé để có kết quả chính xác nhất nha!"
              colorClass="bg-blue-50 text-blue-800"
            />
            <AdviceCard
              icon="🧠"
              title="AI vẫn đang lớn"
              text="Mô hình chưa có khả năng nhận diện 100% các giống chó lai tạp phức tạp hoặc quá hiếm. Kết quả mang tính tham khảo, sen hãy hỏi thêm ý kiến bác sĩ thú y nếu cần nhé!"
              colorClass="bg-amber-50 text-amber-800"
            />
          </div>
        </div>

        {/* ================= CỘT PHẢI: KẾT QUẢ PHÂN TÍCH ================= */}
        <div className="lg:col-span-7">
          {!result && !isLoading ? (
            /* Trạng thái chờ: Hiển thị minh họa hoặc hướng dẫn giống ảnh mẫu */
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-100 rounded-[3rem] shadow-sm">
              <div className="grid grid-cols-3 gap-4 md:gap-8 mb-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-2xl">
                    📸
                  </div>
                  <span className="text-xs font-bold text-gray-400">
                    1. Upload ảnh
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
                    🧠
                  </div>
                  <span className="text-xs font-bold text-gray-400">
                    2. AI phân tích
                  </span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-2xl">
                    🎉
                  </div>
                  <span className="text-xs font-bold text-gray-400">
                    3. Nhận kết quả
                  </span>
                </div>
              </div>
              <p className="text-gray-400 font-medium">
                Kết quả phân tích chi tiết sẽ xuất hiện tại đây
              </p>
            </div>
          ) : isLoading ? (
            /* Trạng thái Loading */
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-[3rem] shadow-sm animate-pulse">
              <div className="w-24 h-24 bg-gray-100 rounded-full mb-6"></div>
              <div className="w-48 h-6 bg-gray-100 rounded-full mb-4"></div>
              <div className="w-64 h-4 bg-gray-50 rounded-full"></div>
            </div>
          ) : result &&
            result.success &&
            result.predictions &&
            result.predictions.length > 0 ? (
            /* Trạng thái Thành công */
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Báo cáo phân tích
                </h2>
                <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  Phân tích thành công
                </span>
              </div>

              {/* Card Top 1: Mức độ trùng khớp cao nhất */}
              <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110"></div>

                <div className="relative z-10">
                  <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">
                    Khả năng cao nhất (Top Match)
                  </p>
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-3xl font-extrabold text-gray-900">
                      {result.predictions[0].breed}
                    </h3>
                    <div className="text-right">
                      <span className="text-3xl font-black text-rose-500">
                        {(result.predictions[0].confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <CuteProgressBar
                    percent={(result.predictions[0].confidence * 100).toFixed(
                      1,
                    )}
                    color="bg-rose-500"
                  />

                  {/* Cụm Action Buttons */}
                  <div className="flex gap-3 mt-8">
                    <button className="flex-1 bg-gray-900 text-white font-bold py-3 px-4 rounded-2xl hover:bg-gray-800 transition-colors text-sm">
                      Lưu hồ sơ
                    </button>
                    <button className="flex-1 bg-rose-50 text-rose-600 font-bold py-3 px-4 rounded-2xl hover:bg-rose-100 transition-colors text-sm">
                      Chia sẻ
                    </button>
                  </div>
                </div>
              </div>

              {/* Các kết quả thay thế (Top 2 & 3) */}
              {result.predictions.length > 1 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-500 px-2 text-sm">
                    Các khả năng lai tạo / nhầm lẫn khác:
                  </h4>
                  {result.predictions.slice(1).map((item, index) => {
                    const percent = (item.confidence * 100).toFixed(1);
                    return (
                      <div
                        key={index}
                        className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 hover:border-gray-200 transition-colors"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-800 text-lg">
                            {item.breed}
                          </span>
                          <span className="font-bold text-gray-400">
                            {percent}%
                          </span>
                        </div>
                        <CuteProgressBar
                          percent={percent}
                          color={index === 0 ? "bg-amber-400" : "bg-blue-300"}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Kết quả thất bại từ AI */
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-red-50 rounded-[3rem] border-2 border-red-100 text-center">
              <div className="text-5xl mb-4">🙈</div>
              <h3 className="font-bold text-red-600 text-xl mb-2">
                Hệ thống hơi bối rối...
              </h3>
              <p className="text-red-500 font-medium">
                {result?.message || "Không thể nhận diện được hình ảnh này."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

