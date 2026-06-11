import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Dùng để điều hướng mượt mà sang trang chi tiết Bách khoa

export const ImageAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file); // Khớp chuẩn xác ô KEY nhị phân đã thông luồng ban nãy

    try {
      const response = await fetch("http://localhost:5000/api/v1/ai/identify", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();

      if (json.success) {
        setResult(json.data);
      } else {
        setError(json.message || "Không thể nhận diện hình ảnh.");
      }
    } catch (err) {
      setError("Mất kết nối tới máy chủ trạm Gateway.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-md grid grid-cols-1 md:grid-cols-12 gap-gutter font-body-md bg-surface text-on-surface">
      {/* CỘT TRÁI: KHU VỰC THAO TÁC UPLOAD & DID YOU KNOW CARD */}
      <div className="md:col-span-5 space-y-md">
        <div className="bg-surface-container-low border-2 border-dashed border-outline-variant rounded-xl p-lg text-center hover:border-primary transition-all relative group">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg shadow-sm"
            />
          ) : (
            <div className="py-lg">
              <span className="material-symbols-outlined text-4xl text-outline group-hover:scale-110 transition-transform">
                cloud_upload
              </span>
              <p className="mt-sm text-body-md text-on-surface-variant">
                Drop your dog's image here or click to browse
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {file && !isLoading && (
          <button
            onClick={handleUpload}
            className="w-full bg-primary text-on-primary py-sm rounded-full font-bold hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            Analyze Canine Specimen
          </button>
        )}

        {/* DID YOU KNOW CARD - Dữ liệu động bốc từ Random FunFact Backend gửi sang */}
        <div className="bg-primary-container text-on-primary-container p-md rounded-xl border border-outline-variant/30">
          <div className="flex items-center gap-xs mb-xs text-coral">
            <span className="material-symbols-outlined text-[20px]">
              lightbulb
            </span>
            <h4 className="font-bold text-label-md uppercase tracking-wider">
              Canine Science Snippet
            </h4>
          </div>
          <p className="text-body-sm opacity-90 italic">
            {result
              ? result.systemFunFact
              : "Dogs have three eyelids, including one that keeps their eyes moist and protected!"}
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: KHU VỰC ĐỔ KẾT QUẢ TOP 3 DIAGNOSTICS */}
      <div className="md:col-span-7 bg-surface-container border border-outline-variant rounded-xl p-md">
        <h3 className="font-headline-md text-primary mb-md border-b border-outline-variant pb-xs">
          Canine Diagnostic Insights
        </h3>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-lg space-y-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-body-md text-on-surface-variant animate-pulse">
              Running architectural feature extraction...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-error-container text-on-error-container p-sm rounded-lg text-body-sm">
            {error}
          </div>
        )}

        {!isLoading && !result && !error && (
          <div className="text-center text-outline py-lg">
            <span className="material-symbols-outlined text-5xl opacity-40">
              pets
            </span>
            <p className="mt-xs text-body-md">
              Awaiting digital specimen processing to render dynamic layout
              profile arrays.
            </p>
          </div>
        )}

        {result && result.predictions && (
          <div className="space-y-md">
            {result.predictions.map((pred, index) => (
              <div
                key={index}
                className="bg-surface-container-low p-sm rounded-lg border border-outline-variant/60 flex flex-col md:flex-row justify-between gap-sm items-start md:items-center"
              >
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-xs">
                    <span className="font-bold text-body-md text-primary">
                      {pred.breed}
                    </span>
                    <span className="font-bold text-label-md text-coral">
                      {pred.confidencePercentage}% Match
                    </span>
                  </div>
                  {/* THANH CUTE PROGRESSBAR THEO TỶ LỆ CONFIDENCE */}
                  <div className="h-3 bg-surface-container-highest rounded-full overflow-hidden w-full">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${pred.confidencePercentage}%` }}
                    ></div>
                  </div>
                </div>

                {pred.dbSynced && pred.details && (
                  <button
                    onClick={() => navigate(`/breeds/${pred.details.breedId}`)}
                    className="bg-white border border-outline text-primary text-label-md px-sm py-1.5 rounded-full font-bold hover:bg-primary hover:text-on-primary transition-all whitespace-nowrap self-end md:self-auto"
                  >
                    View Story →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
