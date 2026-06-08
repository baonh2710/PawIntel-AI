
import { useImageAnalyzer } from "../hooks/useImageAnalyzer";
import { CuteProgressBar } from "../components/common/CuteProgressBar";
import {
  UploadCloud,
  Sparkles,
  Info,
  Heart,
  Share2,
  Activity,
  PawPrint,
  RefreshCcw,
} from "lucide-react";

export function AnalyzerPage() {
  const {
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
  } = useImageAnalyzer();

  const breedData = result?.encyclopedia;
  const funFact = result?.fun_fact;
  const predictionInfo = result?.top_prediction_info;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-3">
            <PawPrint className="text-orange-500 w-10 h-10" />
            PawIntel Identifier
          </h1>
          <p className="text-slate-500 text-lg">
            Discover your dog's breed and learn their unique lifestyle needs.
          </p>
        </header>

        {/* MAIN CONTENT AREA - Căn giữa nếu chưa có result */}
        <div
          className={`transition-all duration-700 ease-in-out ${result ? "grid grid-cols-1 md:grid-cols-12 gap-8" : "max-w-2xl mx-auto"}`}
        >
          {/* UPLOAD & PREVIEW SECTION */}
          <div className={`${result ? "md:col-span-5" : ""} space-y-6`}>
            <div
              className={`relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all bg-white min-h-[350px]
                ${isDragOver ? "border-orange-400 bg-orange-50" : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/50"}
                ${preview ? "border-none p-2" : ""}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!preview ? (
                <>
                  <UploadCloud className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-lg font-medium text-slate-600 mb-1">
                    Drag & Drop your photo here
                  </p>
                  <p className="text-sm text-slate-400 mb-6">
                    Supports JPG, PNG, WEBP (Max 5MB)
                  </p>
                  <label className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full cursor-pointer transition-colors font-medium shadow-sm">
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/jpeg, image/png, image/webp"
                    />
                  </label>
                </>
              ) : (
                <div className="w-full h-full relative group">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-80 object-cover rounded-2xl shadow-sm"
                  />
                  {!isLoading && !result && (
                    <button
                      onClick={handleReset}
                      className="absolute top-3 right-3 bg-white/80 p-2 rounded-full text-slate-600 hover:text-red-500 hover:bg-white transition-all shadow-sm"
                    >
                      <RefreshCcw className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <Info className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* ANALYZE BUTTON */}
            {preview && !result && (
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-semibold py-4 rounded-2xl transition-all shadow-md flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-pulse flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> Analyzing Image...
                  </span>
                ) : (
                  "Identify Breed"
                )}
              </button>
            )}

            {/* RANDOM FUN FACT BANNER */}
            {funFact && (
              <div className="bg-amber-100/50 border border-amber-200 rounded-2xl p-5 relative overflow-hidden">
                <Sparkles className="absolute -top-2 -right-2 text-amber-200 w-16 h-16 opacity-50" />
                <h4 className="text-amber-800 font-semibold mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                  Did you know?
                </h4>
                <p className="text-amber-900/80 text-sm italic leading-relaxed">
                  "{funFact.content}"
                </p>
              </div>
            )}
          </div>

          {/* RESULTS SECTION */}
          {result && (
            <div className="md:col-span-7 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* TOP CARD: Basic Info & Actions */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase mb-3">
                      <Activity className="w-3.5 h-3.5" />
                      {predictionInfo?.confidence
                        ? predictionInfo.confidence.toFixed(1)
                        : 0}
                      % Match
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">
                      {breedData?.name ||
                        (predictionInfo?.breed_id
                          ? predictionInfo.breed_id.replace(/_/g, " ")
                          : "Unknown Breed")}
                    </h2>
                  </div>

                  {/* ACTIONS: Bookmark & Share */}
                  <div className="flex gap-2">
                    <button
                      className="p-3 bg-slate-50 text-slate-500 rounded-full hover:text-red-500 hover:bg-red-50 transition-colors tooltip"
                      title="Save to Profile"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <button
                      className="p-3 bg-slate-50 text-slate-500 rounded-full hover:text-blue-500 hover:bg-blue-50 transition-colors tooltip"
                      title="Share Result"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* ENCYCLOPEDIA DATA */}
                {breedData ? (
                  <div className="space-y-8">
                    {/* STATS */}
                    <div className="grid grid-cols-3 gap-4 text-center divide-x divide-slate-100 bg-slate-50 rounded-2xl p-4">
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold mb-1">
                          Weight
                        </p>
                        <p className="text-slate-700 font-medium">
                          {breedData.physicalStats?.weight}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold mb-1">
                          Height
                        </p>
                        <p className="text-slate-700 font-medium">
                          {breedData.physicalStats?.height}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold mb-1">
                          Lifespan
                        </p>
                        <p className="text-slate-700 font-medium">
                          {breedData.physicalStats?.lifespan}
                        </p>
                      </div>
                    </div>

                    {/* TRAITS TAGS */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3">
                        Core Traits
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {breedData.coreTraits?.map((trait, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* METRICS (PROGRESS BARS) */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">
                        Lifestyle Compatibility
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1 text-slate-600">
                            <span>Trainability</span>
                            <span className="font-bold">
                              {breedData.comparisonMetrics?.trainability || 0}/5
                            </span>
                          </div>
                          <CuteProgressBar
                            score={
                              breedData.comparisonMetrics?.trainability || 0
                            }
                            color="bg-blue-400"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1 text-slate-600">
                            <span>Energy Level</span>
                            <span className="font-bold">
                              {breedData.comparisonMetrics?.energyLevel || 0}/5
                            </span>
                          </div>
                          <CuteProgressBar
                            score={
                              breedData.comparisonMetrics?.energyLevel || 0
                            }
                            color="bg-orange-400"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1 text-slate-600">
                            <span>Apartment Friendly</span>
                            <span className="font-bold">
                              {breedData.comparisonMetrics?.apartmentFriendly ||
                                0}
                              /5
                            </span>
                          </div>
                          <CuteProgressBar
                            score={
                              breedData.comparisonMetrics?.apartmentFriendly ||
                              0
                            }
                            color="bg-emerald-400"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1 text-slate-600">
                            <span>Kid Friendly</span>
                            <span className="font-bold">
                              {breedData.comparisonMetrics?.kidFriendly || 0}/5
                            </span>
                          </div>
                          <CuteProgressBar
                            score={
                              breedData.comparisonMetrics?.kidFriendly || 0
                            }
                            color="bg-rose-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SAMPLE IMAGES */}
                    {breedData.sampleImages?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3">
                          Breed Gallery
                        </h3>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {breedData.sampleImages.map((imgUrl, idx) => (
                            <img
                              key={idx}
                              src={imgUrl}
                              alt={`Sample ${idx}`}
                              className="w-32 h-32 object-cover rounded-2xl shadow-sm border border-slate-100 shrink-0"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CARE ADVICE */}
                    <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                      <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-3">
                        Care Advice
                      </h3>
                      <ul className="space-y-2">
                        {breedData.careAdvice?.map((advice, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-blue-800/80 flex items-start gap-2"
                          >
                            <span className="text-blue-400 mt-0.5">•</span>{" "}
                            {advice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    Oops! We don't have detailed encyclopedia data for this
                    specific breed yet.
                  </div>
                )}
              </div>

              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="text-slate-400 hover:text-slate-600 underline font-medium text-sm transition-colors"
                >
                  Analyze another photo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
