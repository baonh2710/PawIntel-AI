import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const BreedProfile = () => {
  const { breedId } = useParams();
  const [breed, setBreed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/breeds/${breedId}`,
        );
        const json = await response.json();
        if (json.success) {
          setBreed(json.data);
        }
      } catch (err) {
        console.error("Lỗi nạp hồ sơ chi tiết:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [breedId]);

  if (isLoading)
    return (
      <div className="text-center py-xl animate-pulse text-primary">
        Decrypting heritage codex scrolls...
      </div>
    );
  if (!breed)
    return (
      <div className="text-center py-xl text-error">
        Profile Document Expired or Missing.{" "}
        <button onClick={() => navigate("/breeds")} className="underline ml-xs">
          Return to Grid
        </button>
      </div>
    );

  return (
    <main className="max-w-6xl mx-auto p-md space-y-lg font-body-md bg-surface text-on-surface selection:bg-on-tertiary-container selection:text-white">
      {/* HERO SECTION: TIÊU ĐỀ TẠP CHÍ VÀ THÔNG SỐ KHÁI QUÁT */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end border-b border-outline-variant/60 pb-md">
        <div className="lg:col-span-7">
          <span className="font-label-md text-coral tracking-widest block mb-xs">
            CANIS LUPUS FAMILIARIS
          </span>
          <h1 className="font-display-lg text-4xl font-bold text-primary mb-xs">
            {breed.name}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            {breed.description}
          </p>
        </div>
        <div className="lg:col-span-5 bg-surface-container p-sm rounded-xl border border-outline-variant flex justify-around text-center w-full">
          <div>
            <p className="font-label-md text-on-surface-variant opacity-70">
              Origin
            </p>
            <p className="font-headline-sm font-bold text-primary text-body-md">
              {breed.origin}
            </p>
          </div>
          <div className="w-px bg-outline-variant h-full"></div>
          <div>
            <p className="font-label-md text-on-surface-variant opacity-70">
              Lifespan
            </p>
            <p className="font-headline-sm font-bold text-primary text-body-md">
              {breed.physicalStats?.lifespan || "N/A"}
            </p>
          </div>
          <div className="w-px bg-outline-variant h-full"></div>
          <div>
            <p className="font-label-md text-on-surface-variant opacity-70">
              Size Group
            </p>
            <p className="font-headline-sm font-bold text-coral text-body-md">
              {breed.lifestyleFilters?.size || "N/A"}
            </p>
          </div>
        </div>
      </section>

      {/* ANATOMICAL DASHBOARD: THÔNG SỐ CƠ THỂ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-md py-sm border-b border-outline-variant/60">
        <div className="flex items-center gap-sm p-sm bg-surface-container-low rounded-xl border border-outline-variant/40">
          <span className="material-symbols-outlined text-coral text-3xl">
            straighten
          </span>
          <div>
            <h3 className="font-label-md text-on-surface-variant text-xs">
              ARCHITECTURAL HEIGHT
            </h3>
            <p className="font-headline-md font-bold text-primary">
              {breed.physicalStats?.height || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-sm p-sm bg-surface-container-low rounded-xl border border-outline-variant/40">
          <span className="material-symbols-outlined text-coral text-3xl">
            weight
          </span>
          <div>
            <h3 className="font-label-md text-on-surface-variant text-xs">
              SPECIMEN WEIGHT
            </h3>
            <p className="font-headline-md font-bold text-primary">
              {breed.physicalStats?.weight || "N/A"}
            </p>
          </div>
        </div>
      </section>

      {/* CORE TRAITS VISUALIZATION: BIỂU ĐỒ 1-10 PROGRESS BAR */}
      {breed.comparisonMetrics && (
        <section className="bg-surface-container-low p-md rounded-xl border border-outline-variant">
          <h2 className="font-headline-lg text-primary mb-md font-bold text-center">
            Behavioral & Trainability Matrix
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {Object.entries(breed.comparisonMetrics).map(([key, val]) => (
              <div key={key} className="space-y-xs">
                <div className="flex justify-between items-center text-label-md">
                  <span className="capitalize font-bold text-on-surface-variant">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span className="font-bold text-coral">{val * 10}%</span>
                </div>
                <div className="h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{ width: `${val * 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STEWARDSHIP & SPECIAL CARE ADVICE */}
      {breed.careAdvice && breed.careAdvice.length > 0 && (
        <section className="bg-white p-md rounded-xl border border-outline-variant space-y-sm">
          <h2 className="font-headline-lg text-primary font-bold">
            Stewardship & Preventive Care
          </h2>
          <ul className="space-y-sm">
            {breed.careAdvice.map((advice, i) => (
              <li key={i} className="flex items-start gap-base">
                <span className="material-symbols-outlined text-primary text-sm mt-1">
                  eco
                </span>
                <span className="font-body-md text-on-surface-variant">
                  {advice}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};
