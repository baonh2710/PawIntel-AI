import React, { useState } from "react";
import axios from "axios";
import {
  UploadCloud,
  Search,
  Info,
  Bookmark,
  Share2,
  AlertTriangle,
  Download,
  Image as ImageIcon,
  Sparkles,
  Activity,
  Shield,
  Heart,
} from "lucide-react";
import { CuteProgressBar } from "../components/common/CuteProgressBar";

export const AnalyzerDashboard = () => {
  // 1. Quản lý trạng thái
  const [isDragOver, setIsDragOver] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 3. Cập nhật hàm Upload để gọi API (Sẽ trỏ tới Backend Node.js)
  const handleUpload = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/ai/mock-analyze",
      );

      // ✅ check status
      if (res.status !== 200) {
        throw new Error("Server error");
      }

      // ✅ check business logic
      if (!res.data.success) {
        throw new Error("API failed");
      }

      setResult(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  // ... (Giữ nguyên phần return JSX bên dưới, nhưng nhớ đổi biến `result` thành `result` nhé.
  // Ví dụ: `result.encyclopedia.name` -> `result.encyclopedia.name`)

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-md">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-800">PawIntel</h1>
            <p className="text-xs text-slate-500">AI Breed Detection</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
            <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></div>
            <img
              src="https://i.pravatar.cc/100?img=5"
              alt="User"
              className="w-full h-full rounded-full object-cover"
            />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        {/* ================= LEFT COLUMN: ACTION ZONE ================= */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-medium text-slate-800">
              Identify Your Pet
            </h2>
            <button className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full uppercase tracking-wider">
              New Scan
            </button>
          </div>
          <p className="text-sm text-slate-500">
            Drop a photo and let our AI uncover your pet's breed story
          </p>

          {/* Upload Box */}
          <div
            className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-[2.5rem] transition-all duration-300 bg-white/50 backdrop-blur-sm ${
              isDragOver
                ? "border-emerald-400 bg-emerald-50/50 scale-[1.02]"
                : "border-slate-200 hover:border-emerald-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleUpload();
            }}
          >
            <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
              <UploadCloud size={28} />
            </div>
            <p className="font-medium text-slate-700 mb-1">
              Drop your pet's photo
            </p>
            <p className="text-xs text-slate-400 mb-6">
              PNG, JPG, WEBP · Up to 5MB
            </p>

            <div className="flex items-center gap-4 w-full max-w-[200px] mb-6">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs text-slate-400 font-medium">or</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <button
              onClick={handleUpload}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              <UploadCloud size={16} /> Browse Files
            </button>
          </div>

          {/* Fun Fact Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-amber-200"></div>
            <div className="flex items-center gap-2 mb-3 text-amber-600">
              <Sparkles size={18} />
              <h3 className="font-semibold text-sm">Did you know?</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {result?.funFact}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                <div className="w-4 h-1.5 bg-amber-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
              </div>
              <button className="text-xs font-medium text-slate-400 hover:text-amber-600 transition-colors">
                Next fact →
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-white border border-slate-100 rounded-2xl py-4 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm">
              <Bookmark size={18} />
              <span className="text-xs font-medium">Save</span>
            </button>
            <button className="bg-white border border-slate-100 rounded-2xl py-4 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
              <Share2 size={18} />
              <span className="text-xs font-medium">Share</span>
            </button>
            <button className="bg-white border border-slate-100 rounded-2xl py-4 flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-sm">
              <AlertTriangle size={18} />
              <span className="text-xs font-medium">Report</span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: INSIGHT ZONE ================= */}
        <div className="lg:col-span-8">
          {error ? (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-red-500">
              <AlertTriangle size={40} />
              <p className="mt-2 font-medium">{error}</p>
            </div>
          ) : !result ? (
            // Empty State / Loading
            <div className="h-full min-h-[600px] border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400">
              {loading ? (
                <div className="flex flex-col items-center gap-4 animate-pulse">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                  <p className="font-medium text-slate-500">
                    Analyzing your pet's features...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 opacity-50">
                  <ImageIcon size={48} strokeWidth={1} />
                  <p>Awaiting your pet's photo...</p>
                </div>
              )}
            </div>
          ) : (
            // Results Dashboard
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">
                    Breed Analysis Report
                  </h2>
                  <h3 className="text-3xl font-serif text-emerald-800">
                    Your Pet's Story
                  </h3>
                </div>
                <div className="flex gap-2">
                  <span className="bg-white border border-slate-200 text-slate-500 px-4 py-2 rounded-full text-xs font-medium shadow-sm flex items-center gap-2">
                    <Info size={14} /> Jun 8, 2026
                  </span>
                </div>
              </div>

              {/* Hero Image Card */}
              <div className="relative rounded-[2rem] overflow-hidden h-[340px] shadow-sm group">
                <img
                  src={result.encyclopedia.primaryImage}
                  alt="Dog"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Tags Top Left */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                    PRIMARY BREED
                  </span>
                  <span className="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                    MEDIUM-LARGE
                  </span>
                </div>

                {/* Match Badge Top Right */}
                <div className="absolute top-6 right-6 w-20 h-20 bg-white/90 backdrop-blur-md rounded-full flex flex-col items-center justify-center shadow-lg border-4 border-emerald-100/50">
                  <span className="text-xl font-bold text-emerald-700">
                    {result.topMatch.confidence}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    Match
                  </span>
                </div>

                {/* Breed Info Bottom */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-1 drop-shadow-md">
                      {result?.encyclopedia.name}
                    </h1>
                    <p className="text-emerald-100 text-sm font-medium">
                      {result.encyclopedia.scientificName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {result.encyclopedia.coreTraits.map((trait, idx) => (
                      <span
                        key={idx}
                        className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs px-4 py-1.5 rounded-full font-medium"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Physical Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-slate-400">
                    <div className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                      <Info size={14} />
                    </div>
                    <span className="text-xs font-bold tracking-wider uppercase">
                      Weight
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-slate-700 mb-3">
                    {result.encyclopedia.physicalStats.weight}
                  </div>
                  <CuteProgressBar percent={60} color="bg-amber-300" />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 uppercase font-semibold">
                    <span>Toy</span>
                    <span>Giant</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-slate-400">
                    <div className="w-6 h-6 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
                      <Activity size={14} />
                    </div>
                    <span className="text-xs font-bold tracking-wider uppercase">
                      Height
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-slate-700 mb-3">
                    {result.encyclopedia.physicalStats.height}
                  </div>
                  <CuteProgressBar percent={70} color="bg-rose-300" />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 uppercase font-semibold">
                    <span>Short</span>
                    <span>Tall</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-slate-400">
                    <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                      <Heart size={14} />
                    </div>
                    <span className="text-xs font-bold tracking-wider uppercase">
                      Lifespan
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-slate-700 mb-3">
                    {result.encyclopedia.physicalStats.lifespan}
                  </div>
                  <CuteProgressBar percent={80} color="bg-emerald-300" />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-2 uppercase font-semibold">
                    <span>Short</span>
                    <span>Long</span>
                  </div>
                </div>
              </div>

              {/* Personality Profile */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-slate-500 font-medium">
                    Personality Profile
                  </h3>
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-400 px-3 py-1 rounded-full">
                    Based on Breed Data
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-6">
                  {[
                    {
                      label: "Energy",
                      score: result.encyclopedia.comparisonMetrics.energyLevel,
                      color: "bg-emerald-500",
                    },
                    {
                      label: "Sociability",
                      score: result.encyclopedia.comparisonMetrics.sociability,
                      color: "bg-amber-400",
                    },
                    {
                      label: "Trainability",
                      score: result.encyclopedia.comparisonMetrics.trainability,
                      color: "bg-rose-400",
                    },
                    {
                      label: "Guarding",
                      score: result.encyclopedia.comparisonMetrics.guarding,
                      color: "bg-slate-300",
                    },
                  ].map((trait, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-2xl font-semibold text-slate-700">
                          {trait.score}
                        </span>
                        <span className="text-sm text-slate-400">/10</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full mb-2 overflow-hidden">
                        <div
                          className={`h-full ${trait.color} rounded-full`}
                          style={{ width: `${(trait.score / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        {trait.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Matches */}
              <div>
                <div className="flex justify-between items-end mb-4 px-2">
                  <h3 className="text-slate-600 font-medium">
                    Other Possible Matches
                  </h3>
                  <span className="text-xs text-slate-400">
                    Sorted by confidence
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {result.otherMatches.map((match, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3"
                    >
                      <img
                        src={match.image}
                        alt={match.breed}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-700 truncate">
                          {match.breed}
                        </h4>
                        <p className="text-[10px] text-slate-400 uppercase">
                          Sporting Group
                        </p>
                        <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5">
                          <div
                            className="h-full bg-orange-300 rounded-full"
                            style={{ width: `${match.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-slate-500">
                        {match.confidence}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Story & Care */}
              <div className="bg-emerald-50/50 p-8 rounded-[2rem] border border-emerald-100/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                    <Info size={16} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                      Breed Story
                    </h4>
                    <h3 className="text-xl font-serif text-emerald-900">
                      The Golden's Heritage
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-emerald-800/80 leading-relaxed mb-6">
                  {result.encyclopedia.story}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {result.encyclopedia.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {result.encyclopedia.careAdvice.map((care, i) => (
                    <div
                      key={i}
                      className="bg-white p-5 rounded-[1.5rem] shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-3 text-slate-500">
                        {i === 0 ? (
                          <Activity size={16} />
                        ) : (
                          <Sparkles size={16} />
                        )}
                        <h5 className="text-sm font-medium">{care.title}</h5>
                      </div>
                      <CuteProgressBar
                        percent={i === 0 ? 80 : 60}
                        color={i === 0 ? "bg-amber-400" : "bg-rose-400"}
                      />
                      <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                        {care.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
