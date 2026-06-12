import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/v1";

const metricDefinitions = {
  trainability: {
    label: "Trainability",
    desc: "Capacity to absorb and execute curatorial instructions.",
    scale: "1: Stubborn instinct — 5: Highly compliant",
  },
  energyLevel: {
    label: "Energy Level",
    desc: "Daily kinetic output and physical stamina requirements.",
    scale: "1: Sedentary nature — 5: Relentless endurance",
  },
  apartmentFriendly: {
    label: "Apartment Friendly",
    desc: "Suitability for confined living spaces and restricted boundaries.",
    scale: "1: Requires acreage — 5: Thrives in compact quarters",
  },
  kidFriendly: {
    label: "Kid Friendly",
    desc: "Patience and gentleness when interacting with human children.",
    scale: "1: Easily overwhelmed — 5: Highly nurturing",
  },
  aloneTolerance: {
    label: "Alone Tolerance",
    desc: "Psychological resilience when left in complete solitude.",
    scale: "1: Severe separation anxiety — 5: Highly independent",
  },
  petFriendly: {
    label: "Pet Friendly",
    desc: "Sociability and pack-tolerance towards other biological specimens.",
    scale: "1: Highly territorial — 5: Universally amicable",
  },
};

const lifestyleDefinitions = {
  size: {
    label: "Morphological Size",
    desc: "General body mass and structural scale at full maturity.",
  },
  sheddingLevel: {
    label: "Shedding Level",
    desc: "Frequency and volume of fur renewal and follicle shedding.",
  },
  spaceRequirement: {
    label: "Space Requirement",
    desc: "Minimum spatial volume needed for psychological well-being.",
  },
  barkingLevel: {
    label: "Vocalization",
    desc: "Tendency for audible communication and territorial barking.",
  },
  weatherTolerance: {
    label: "Climate Adaptability",
    desc: "Biological resilience against extreme temperature fluctuations.",
  },
  vulnerabilityToDisease: {
    label: "Pathological Vulnerability",
    desc: "Overall genetic resistance to common canine ailments.",
  },
};

export function BreedProfile() {
  const { breedId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [breed, setBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFromIdentify = location.state?.from === "identify";

  useEffect(() => {
    const fetchBreed = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/encyclopedia/breeds/${breedId}`,
        );
        setBreed(response.data.data);
      } catch (err) {
        console.error("Archive Retrieval Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBreed();
  }, [breedId]);

  if (loading)
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-surface font-body-md text-secondary italic">
        Consulting biological archives...
      </div>
    );
  if (!breed)
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-surface font-headline-lg text-error">
        Record Not Found
      </div>
    );

  const calculateProgress = (val) => `${((val || 0) / 5) * 100}%`;
  const heroImage = breed.visualArchives?.[0]?.url || breed.thumbnail;
  const vintageImage = breed.visualArchives?.[1]?.url || breed.thumbnail;

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col antialiased">
      {/* Header / Navbar */}
      <header className="bg-surface border-b border-secondary/10 sticky top-0 z-50">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-5 max-w-container-max mx-auto w-full">
          <div
            className="font-headline-lg text-primary tracking-tighter cursor-pointer"
            onClick={() => navigate("/")}
          >
            Canis Archive
          </div>
          <nav className="hidden md:flex gap-10 items-center">
            <span
              onClick={() => navigate("/")}
              className="text-primary font-bold border-b-2 border-primary pb-1 cursor-pointer"
            >
              Encyclopedia
            </span>
            <span
              onClick={() => navigate("/identify")}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Identify
            </span>
          </nav>
        </div>
      </header>

      <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-20">
        {/* Navigation Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center self-start gap-2 font-label-md uppercase tracking-[0.2em] text-secondary/60 hover:text-primary transition-all bg-transparent border-none cursor-pointer -mb-10 group shadow-none"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          {isFromIdentify ? "Return to Identification" : "Return to Archive"}
        </button>

        {/* 1. HERO SECTION - CỰC KỲ ĐẬM CHẤT TẠP CHÍ */}
        <section className="flex flex-col gap-10 items-center text-center">
          {/* Thay bg-tertiary bằng mã màu terracotta dạng gạch nung [ #e3735e ] hoặc [ #c65a39 ] */}
          <div className="inline-flex items-center px-5 py-1.5 bg-[#e3a392] text-white rounded-sm font-label-md uppercase tracking-[0.15em] text-[11px]">
            {breed.origin || "Unknown Origin"}
          </div>

          {/* Tên to bản, quyền lực */}
          <h1 className="font-headline-xl text-[64px] leading-none text-on-surface tracking-tight">
            {breed.name}
          </h1>

          {/* Hero Image với Matte Frame (Khung bảo tàng) */}
          <div className="w-full p-2 bg-surface-container-lowest border border-secondary/10 rounded-lg shadow-none overflow-hidden">
            <div className="w-full aspect-[21/9] rounded overflow-hidden">
              <img
                alt={breed.name}
                className="w-full h-full object-cover"
                src={heroImage}
              />
            </div>
          </div>

          <p className="max-w-3xl text-on-surface-variant font-body-md text-[18px] leading-[1.8] text-center italic opacity-90">
            {breed.description}
          </p>

          {/* Traits Styled as Editorial Badges */}
          {breed.coreTraits && (
            <div className="flex flex-wrap justify-center gap-3">
              {breed.coreTraits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-5 py-2 border border-primary/20 text-primary font-label-md uppercase tracking-widest text-[10px] rounded-full bg-primary/5"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* 2. PHYSICAL STATS - Tonal Layering */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              label: "Weight Range",
              val: breed.physicalStats?.weight,
              unit: "kg",
            },
            {
              label: "Height Average",
              val: breed.physicalStats?.height,
              unit: "cm",
            },
            {
              label: "Life Expectancy",
              val: breed.physicalStats?.lifespan,
              unit: "yrs",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-surface-container-low border border-secondary/10 rounded p-10 flex flex-col items-center justify-center text-center gap-3"
            >
              <span className="font-label-md text-secondary/60 uppercase tracking-[0.2em] text-[11px]">
                {stat.label}
              </span>
              <span className="font-headline-lg text-[40px] text-primary-container">
                {stat.val?.split(" ")[0]}{" "}
                <span className="text-body-sm font-normal text-on-surface-variant/50">
                  {stat.unit}
                </span>
              </span>
            </div>
          ))}
        </section>

        {/* 3. ARCHIVAL ORIGINS - Narrative Driven */}
        <section className="flex flex-col md:flex-row gap-16 items-center border-y border-secondary/10 py-16">
          <div className="w-full md:w-1/2 p-2 bg-surface-container-lowest border border-secondary/10 rounded-lg">
            <img
              alt="Vintage record"
              className="w-full aspect-[4/3] object-cover grayscale sepia-[.3] brightness-[.9] rounded"
              src={vintageImage}
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-8 text-left">
            <h2 className="font-headline-lg text-[36px] text-on-surface">
              Archival Origins
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-[17px]">
              {breed.historySnippet}
            </p>
            {breed.breedSpecificFacts?.map((fact, idx) => (
              <blockquote
                key={idx}
                className="italic border-l-3 border-tertiary pl-8 py-2 text-on-surface-variant font-body-md text-[18px] opacity-80 leading-relaxed"
              >
                "{fact}"
              </blockquote>
            ))}
          </div>
        </section>

        {/* 4. TAXONOMY & ANALYTICS */}
        <section className="flex flex-col gap-10">
          <h2 className="font-headline-lg text-center text-[36px] text-on-surface">
            Biological & Behavioral Taxonomy
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Qualitative Sidebar */}
            <div className="bg-surface-container-low border border-secondary/10 rounded p-10 flex flex-col gap-8 shadow-none">
              <h3 className="font-label-md text-secondary uppercase tracking-[0.2em] border-b border-secondary/10 pb-5 text-[12px]">
                Lifestyle Classification
              </h3>
              <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                {Object.entries(breed.lifestyleFilters || {}).map(
                  ([key, value]) => {
                    const def = lifestyleDefinitions[key] || { label: key };
                    return (
                      <div
                        key={key}
                        className="flex flex-col gap-2 group relative"
                      >
                        <span className="font-label-md text-secondary/60 uppercase tracking-widest text-[10px] cursor-help border-b border-dashed border-secondary/30 w-fit">
                          {def.label}
                        </span>
                        <span className="font-body-md text-on-surface text-[16px] font-medium">
                          {value}
                        </span>
                        <div className="absolute z-30 bottom-full left-0 mb-3 w-56 bg-secondary text-surface-container-lowest rounded p-3 text-[12px] leading-tight hidden group-hover:block transition-all shadow-xl">
                          {def.desc}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* Quantitative Analytics */}
            <div className="bg-surface-container border border-secondary/10 rounded p-10 flex flex-col gap-8 shadow-none">
              <h3 className="font-label-md text-secondary uppercase tracking-[0.2em] border-b border-secondary/10 pb-5 text-[12px]">
                Analytical Metrics
              </h3>
              <div className="flex flex-col gap-7">
                {Object.entries(breed.comparisonMetrics || {}).map(
                  ([key, value]) => {
                    const def = metricDefinitions[key] || { label: key };
                    return (
                      <div
                        key={key}
                        className="flex flex-col gap-3 group relative"
                      >
                        <div className="flex justify-between items-end">
                          <span className="font-label-md text-on-surface uppercase tracking-widest text-[11px] cursor-help border-b border-dashed border-secondary/30">
                            {def.label}
                          </span>
                          <span className="font-label-md text-primary font-bold">
                            {value} / 5
                          </span>
                        </div>
                        <div className="w-full bg-secondary/10 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: calculateProgress(value) }}
                          ></div>
                        </div>
                        <div className="absolute z-30 bottom-full left-0 mb-3 w-64 bg-primary text-surface-container-lowest rounded p-4 text-[12px] leading-normal hidden group-hover:block shadow-xl">
                          <p className="mb-2 font-medium">{def.desc}</p>
                          <p className="opacity-70 italic text-[10px]">
                            {def.scale}
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 5. CARE & HEALTH */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-8">
            <h3 className="font-headline-lg text-[32px]">Care Advice</h3>
            <div className="bg-surface-container border border-secondary/10 rounded p-8 flex flex-col gap-8">
              {breed.careAdvice?.map((advice, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-5 pb-6 border-b border-secondary/10 last:border-0 last:pb-0"
                >
                  <span className="material-symbols-outlined text-primary mt-1">
                    menu_book
                  </span>
                  <p className="font-body-md text-on-surface-variant leading-relaxed text-[16px]">
                    {advice}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <h3 className="font-headline-lg text-[32px]">Health Risks</h3>
            <div className="bg-[#E3A392]/5 border border-tertiary/20 rounded p-8 flex flex-col gap-6">
              <p className="font-body-md text-on-surface-variant leading-relaxed opacity-80 italic">
                Historical records indicate potential pathological
                vulnerabilities.
              </p>
              <ul className="flex flex-col gap-5">
                {breed.healthRisks?.map((health, idx) => (
                  <li key={idx} className="flex items-center gap-4 group">
                    <span className="w-2 h-2 rounded-full bg-tertiary group-hover:scale-125 transition-transform"></span>
                    <span className="font-body-md text-on-surface text-[17px]">
                      {health}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. VISUAL ARCHIVES */}
        {breed.visualArchives && breed.visualArchives.length > 0 && (
          <section className="flex flex-col gap-10 border-t border-secondary/10 pt-20">
            <h2 className="font-headline-lg text-center text-[36px]">
              Visual Archives
            </h2>
            <div
              className={`grid gap-8 w-full ${
                breed.visualArchives.length === 1
                  ? "grid-cols-1 max-w-2xl mx-auto"
                  : breed.visualArchives.length === 2
                    ? "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              }`}
            >
              {breed.visualArchives.map((img, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-3 group cursor-pointer"
                >
                  {/* Khung chứa ảnh */}
                  <div className="w-full aspect-square rounded-lg bg-surface-container overflow-hidden border border-secondary/10">
                    <img
                      src={img.url}
                      alt={img.caption || "Archival documentation"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                    />
                  </div>
                  {/* Dòng chữ caption hồ sơ lưu trữ nhỏ mịn đặt dưới ảnh */}
                  <p className="font-label-md text-[11px] uppercase tracking-[0.15em] text-on-surface-variant/70 leading-relaxed group-hover:text-primary transition-colors line-clamp-2">
                    {img.caption}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
