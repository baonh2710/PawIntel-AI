import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/v1";

export function ImageAnalyzer() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [systemFunFact, setSystemFunFact] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadingFacts = [
    "Analyzing cranial structure metrics...",
    "Cross-referencing pigmentary traits with archival data...",
    "Evaluating morphological indicators...",
  ];

  useEffect(() => {
    let interval;
    if (loading) {
      let i = 0;
      setLoadingText(loadingFacts[0]);
      interval = setInterval(() => {
        i++;
        setLoadingText(loadingFacts[i % loadingFacts.length]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const savedResults = sessionStorage.getItem("identifyResults");
    const savedPreviewUrl = sessionStorage.getItem("identifyPreviewUrl");
    const savedFact = sessionStorage.getItem("identifyFact");

    if (savedResults && savedPreviewUrl) {
      setResults(JSON.parse(savedResults));
      setPreviewUrl(savedPreviewUrl);
      setSystemFunFact(savedFact || "");
    }
  }, []);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer?.files[0] || e.target.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setError(null); // Reset lỗi cũ trước khi scan mới

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_BASE}/ai/identify`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success) {
        const preds = response.data.data.predictions;
        const fact = response.data.data.systemFunFact;

        setResults(preds);
        setSystemFunFact(fact);

        sessionStorage.setItem("identifyResults", JSON.stringify(preds));
        sessionStorage.setItem("identifyFact", fact);
        sessionStorage.setItem("identifyPreviewUrl", previewUrl);
      } else {
        // API trả về success: false
        setError(
          "Do nguồn dữ liệu lưu trữ hữu hạn (hiện giới hạn ở 120 giống chó nguyên bản) hoặc do góc độ, ánh sáng của tiêu bản chưa đạt chuẩn, hệ thống không thể trích xuất đặc điểm nhận dạng. Vui lòng thử lại với một góc chụp khác trực diện hơn.",
        );
      }
    } catch (err) {
      console.error("Lỗi phân tích hình ảnh:", err);
      // API lỗi (500, network error...)
      setError(
        "Hệ thống lưu trữ gián đoạn hoặc hình ảnh không hợp lệ. Nguồn dữ liệu hiện chỉ giới hạn ở 120 giống, vui lòng cung cấp một hình ảnh tiêu bản khác rõ nét hơn.",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setFile(null);
    setPreviewUrl(null);
    setResults(null);
    setSystemFunFact("");
    setError(null); // Nhớ reset cả error khi tạo scan mới
    sessionStorage.removeItem("identifyResults");
    sessionStorage.removeItem("identifyPreviewUrl");
    sessionStorage.removeItem("identifyFact");
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col antialiased selection:bg-tertiary selection:text-on-tertiary">
      <header className="bg-surface border-b border-secondary/20 sticky top-0 z-50">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto w-full">
          <div
            className="font-headline-lg text-primary tracking-tight cursor-pointer"
            onClick={() => navigate("/")}
          >
            Canis Archive
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <span
              onClick={() => navigate("/")}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer border-b-2 border-transparent pb-1"
            >
              Encyclopedia
            </span>
            <span className="text-primary font-bold border-b-2 border-primary pb-1 cursor-pointer">
              Identify
            </span>
          </nav>
        </div>
      </header>

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-12">
        {!results && (
          <header className="flex flex-col items-center text-center max-w-2xl mx-auto gap-4 mt-8">
            <h1 className="font-headline-xl text-primary">Digitize Specimen</h1>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Upload high-resolution photography of the subject to engage the
              archival identification matrix. Ensure neutral lighting for
              optimal phenotypical analysis.
            </p>
          </header>
        )}

        {!results && !loading && (
          <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto w-full">
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="w-full h-80 border-2 border-dashed border-primary/30 bg-surface-container rounded-lg flex flex-col items-center justify-center gap-5 cursor-pointer hover:bg-surface-container-high transition-colors shadow-none relative overflow-hidden group"
            >
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[40px] text-primary mb-2">
                      swap_horiz
                    </span>
                    <p className="font-label-md text-primary uppercase tracking-[0.2em] font-bold">
                      Change Specimen
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[60px] text-secondary/50">
                    photo_camera
                  </span>
                  <div className="text-center">
                    <p className="font-label-md text-primary uppercase tracking-[0.15em] font-bold mb-2">
                      Drag & Drop Image
                    </p>
                    <p className="font-body-md text-secondary italic">
                      or click to browse local archives
                    </p>
                  </div>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileDrop}
              />
            </label>

            <button
              onClick={handleScan}
              disabled={!file}
              className="px-12 py-4 rounded font-label-md uppercase tracking-[0.2em] font-bold transition-colors duration-300 border-none cursor-pointer bg-primary text-white hover:bg-[#0f2e0d] disabled:bg-secondary/10 disabled:text-secondary/50 disabled:cursor-not-allowed shadow-none"
            >
              Commence Analysis
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center gap-8 h-80 w-full max-w-2xl mx-auto bg-surface-container-low border border-secondary/10 rounded p-12">
            <div className="w-12 h-12 border-2 border-secondary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="font-body-md text-primary italic text-center animate-pulse min-h-[1.5rem] tracking-wide">
              {loadingText}
            </p>
          </div>
        )}
        {/* ERROR STATE UI */}
        {error && !loading && !results && (
          <div className="flex flex-col items-center justify-center gap-6 w-full max-w-2xl mx-auto bg-[#3e1111]/5 border border-[#3e1111]/20 p-10 rounded shadow-none animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#8b2b2b]"></div>
            <span className="material-symbols-outlined text-[48px] text-[#8b2b2b]">
              troubleshoot
            </span>
            <div className="text-center flex flex-col gap-3">
              <h3 className="font-headline-md text-[#3e1111] uppercase tracking-widest text-[18px]">
                Identification Failed
              </h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed max-w-lg mx-auto">
                {error}
              </p>
            </div>
            <button
              onClick={resetScan}
              className="mt-2 font-label-md text-primary hover:text-primary/80 transition-colors flex items-center gap-2 uppercase tracking-[0.15em] cursor-pointer bg-transparent border-b border-primary pb-1 font-bold"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Try Another Specimen
            </button>
          </div>
        )}

        {results && !loading && (
          <section className="flex flex-col gap-10 w-full animate-fade-in">
            <div className="flex items-center justify-between border-b border-secondary/10 pb-6">
              <h2 className="font-headline-lg text-[32px] text-on-surface">
                Identification Results
              </h2>
              <button
                onClick={resetScan}
                className="font-label-md text-secondary hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-[0.15em] cursor-pointer bg-transparent border-0 font-bold"
              >
                <span className="material-symbols-outlined text-sm">
                  refresh
                </span>{" "}
                New Scan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-5 flex flex-col gap-4 sticky top-24">
                <div className="w-full aspect-[4/5] bg-surface-container-high relative overflow-hidden border border-secondary/20 rounded shadow-none">
                  <img
                    alt="Specimen Scan"
                    className="w-full h-full object-cover"
                    src={previewUrl}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-[#e3a392]/25 text-[#1e1c10] font-label-md font-semibold text-[10px] uppercase tracking-wider rounded-sm backdrop-blur-md shadow-none">
                      SCAN COMPLETE
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-surface-container-lowest/40 text-[#1e1c10] font-label-md font-semibold text-[10px] uppercase tracking-wider rounded-sm backdrop-blur-md shadow-none">
                      REF: {Math.floor(Math.random() * 900) + 100}-A
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 flex flex-col gap-8">
                {results.length > 0 && (
                  <div className="bg-surface-container-low border border-secondary/10 p-10 flex flex-col gap-8 relative overflow-hidden rounded shadow-none">
                    <div className="absolute -right-8 -top-8 opacity-[0.03] pointer-events-none">
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: "200px",
                          fontVariationSettings: "'FILL' 1",
                        }}
                      >
                        pets
                      </span>
                    </div>

                    {/* ĐÃ FIX: Cho phép flex-wrap để Badge tự động rớt xuống nếu tên quá dài, tránh ép gãy chữ */}
                    <div className="flex flex-wrap sm:flex-nowrap justify-between items-start z-10 gap-4">
                      <div className="flex flex-col gap-2 flex-1 min-w-[60%]">
                        <div className="font-label-md text-secondary/70 tracking-[0.2em] uppercase text-[11px] font-bold">
                          Primary Match Designation
                        </div>
                        {/* Đổi break-words thành break-normal, thêm hyphens-auto để ngắt từ mượt hơn */}
                        <h3 className="font-headline-xl text-primary text-[36px] sm:text-[48px] leading-[1.1] break-normal hyphens-auto">
                          {results[0].breed}
                        </h3>
                      </div>

                      <div className="bg-primary text-white px-5 py-3 font-label-md flex items-center gap-2 rounded uppercase tracking-widest shadow-none shrink-0 mt-1">
                        <span className="material-symbols-outlined text-[18px]">
                          verified
                        </span>
                        {results[0].confidencePercentage}% Match
                      </div>
                    </div>

                    <p className="font-body-md text-on-surface-variant leading-[1.8] text-[16px] max-w-xl z-10">
                      {results[0].details?.description ||
                        "Phenotypic analysis indicates correlation with archival records. Proceed to full profile for anatomical data."}
                    </p>

                    {results[0].details?.coreTraits && (
                      <div className="flex flex-wrap gap-3 z-10">
                        {results[0].details.coreTraits
                          .slice(0, 4)
                          .map((trait, idx) => (
                            <span
                              key={idx}
                              className="bg-surface-container-highest text-on-surface font-label-md px-4 py-2 border border-secondary/20 uppercase tracking-widest text-[10px] rounded shadow-none"
                            >
                              {trait}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="mt-2 pt-8 border-t border-secondary/10 z-10 flex justify-start">
                      <button
                        onClick={() =>
                          results[0].dbSynced &&
                          navigate(`/breeds/${results[0].details.breedId}`, {
                            state: { from: "identify" },
                          })
                        }
                        disabled={!results[0].dbSynced}
                        className="group bg-primary text-white font-label-md uppercase tracking-[0.2em] font-bold px-8 py-4 hover:bg-[#0f2e0d] transition-colors duration-300 flex items-center gap-3 rounded disabled:bg-secondary/20 disabled:text-secondary/60 disabled:cursor-not-allowed border-none cursor-pointer shadow-none"
                      >
                        {results[0].dbSynced
                          ? "View Archival Record"
                          : "Record Not In Database"}
                        {results[0].dbSynced && (
                          <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">
                            arrow_forward
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {results.length > 1 && (
                  <div className="flex flex-col gap-4">
                    <h4 className="font-label-md text-secondary/70 uppercase tracking-[0.2em] font-bold mt-4 border-b border-secondary/10 pb-3 text-[11px]">
                      Sub-Variant Deviations
                    </h4>

                    {results.slice(1, 3).map((match, idx) => (
                      <article
                        key={idx}
                        className={`relative bg-surface border border-secondary/20 p-4 flex justify-between items-center transition-colors duration-300 rounded-sm shadow-none group ${
                          match.dbSynced
                            ? "hover:bg-surface-container-low cursor-pointer"
                            : "opacity-70 cursor-not-allowed"
                        }`}
                      >
                        {/* VÙNG CLICK ĐIỀU HƯỚNG */}
                        <div
                          className="flex flex-1 items-center gap-4 min-w-0"
                          onClick={() =>
                            match.dbSynced &&
                            navigate(`/breeds/${match.details?.breedId}`, {
                              state: { from: "identify" },
                            })
                          }
                        >
                          <div className="w-12 h-12 bg-surface-variant border border-secondary/10 flex items-center justify-center text-secondary shrink-0 rounded-sm">
                            <span className="material-symbols-outlined text-[24px]">
                              {match.dbSynced ? "search" : "visibility_off"}
                            </span>
                          </div>

                          <div className="flex flex-col gap-0.5 truncate">
                            <div
                              className={`font-headline-lg text-lg text-on-surface transition-colors truncate ${match.dbSynced && "group-hover:text-primary"}`}
                            >
                              {match.breed}
                            </div>
                            <div className="font-body-sm text-secondary flex items-center gap-2 truncate text-[13px]">
                              <span>
                                {idx === 0
                                  ? "Secondary correlation noted."
                                  : "Tertiary correlation noted."}
                                {!match.dbSynced && " (Unarchived)"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Tỷ lệ % */}
                        <div className="flex items-center gap-3 shrink-0 pl-4 pointer-events-none">
                          <div className="font-label-md text-secondary">
                            {match.confidencePercentage}%
                          </div>
                          {match.dbSynced && (
                            <span className="material-symbols-outlined text-secondary/40 group-hover:text-primary transition-colors">
                              arrow_forward
                            </span>
                          )}
                        </div>

                        {/* TOOLTIP HIỂN THỊ CHỈ SỐ (Đã fix dứt điểm lỗi lệch hàng bằng Grid) */}
                        {match.dbSynced && match.details && (
                          <div className="absolute right-[110%] top-1/2 -translate-y-1/2 w-[280px] bg-surface-container-high border border-secondary/20 shadow-lg p-4 rounded z-50 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col gap-3">
                            <div className="font-label-md text-primary uppercase tracking-widest text-[11px] font-bold border-b border-secondary/10 pb-2">
                              {match.breed} Specifications
                            </div>

                            {/* Chuyển thành flex-col với gap để các hàng xếp chồng ngay ngắn */}
                            <div className="flex flex-col gap-2.5">
                              {/* 1. Cân nặng (Weight) */}
                              {match.details.physicalStats?.weight && (
                                <div className="grid grid-cols-[130px_1fr] items-center text-[12px]">
                                  <span className="text-secondary font-body-sm flex items-center gap-1.5 whitespace-nowrap">
                                    <span className="material-symbols-outlined text-[14px] opacity-70">
                                      scale
                                    </span>
                                    Weight Metric
                                  </span>
                                  <span className="text-primary font-bold text-[11px] text-right whitespace-nowrap">
                                    {match.details.physicalStats.weight}
                                  </span>
                                </div>
                              )}

                              {/* 2. Chiều cao (Height) */}
                              {match.details.physicalStats?.height && (
                                <div className="grid grid-cols-[130px_1fr] items-center text-[12px]">
                                  <span className="text-secondary font-body-sm flex items-center gap-1.5 whitespace-nowrap">
                                    <span className="material-symbols-outlined text-[14px] opacity-70">
                                      straighten
                                    </span>
                                    Height Metric
                                  </span>
                                  <span className="text-primary font-bold text-[11px] text-right whitespace-nowrap">
                                    {match.details.physicalStats.height}
                                  </span>
                                </div>
                              )}

                              {/* 3. Nguồn gốc xuất xứ (Origin) */}
                              {match.details.origin && (
                                <div className="grid grid-cols-[130px_1fr] items-center text-[12px]">
                                  <span className="text-secondary font-body-sm flex items-center gap-1.5 whitespace-nowrap">
                                    <span className="material-symbols-outlined text-[14px] opacity-70">
                                      public
                                    </span>
                                    Geographic Origin
                                  </span>
                                  {/* text-right kết hợp whitespace-nowrap để bám lề phải mượt mà */}
                                  <span className="text-primary font-bold text-[11px] tracking-wide text-right whitespace-nowrap truncate">
                                    {match.details.origin.replaceAll(
                                      " / ",
                                      ", ",
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Tam giác nhỏ trỏ vào thẻ cha */}
                            <div className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-surface-container-high border-r border-t border-secondary/20 rotate-45"></div>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                )}

                {systemFunFact && (
                  <div className="mt-6 bg-tertiary/5 border-l-4 border-tertiary p-6 rounded-r">
                    <p className="font-label-md text-tertiary uppercase tracking-widest mb-3 text-[11px] font-bold">
                      Curatorial Trivia
                    </p>
                    <p className="font-body-md text-on-surface-variant italic leading-relaxed">
                      {systemFunFact}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="w-full rounded-none border-t border-secondary/20 bg-surface-container-high py-12 mt-auto">
        <div className="w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-headline-md text-secondary">Canis Archive</div>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="text-secondary hover:text-primary transition-colors font-body-sm cursor-pointer border-b border-transparent hover:border-primary pb-0.5">
              Scientific References
            </span>
            <span className="text-secondary hover:text-primary transition-colors font-body-sm cursor-pointer border-b border-transparent hover:border-primary pb-0.5">
              Ethical Research
            </span>
            <span className="text-secondary hover:text-primary transition-colors font-body-sm cursor-pointer border-b border-transparent hover:border-primary pb-0.5">
              Privacy Policy
            </span>
          </div>
          <div className="text-secondary font-body-sm text-center md:text-right opacity-80">
            © 2026 Canis Archive. A Scholarly Digital Arboretum.
          </div>
        </div>
      </footer>
    </div>
  );
}
