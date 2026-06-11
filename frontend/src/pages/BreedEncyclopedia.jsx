import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const BreedEncyclopedia = () => {
  const [breeds, setBreeds] = useState([]);
  const [search, setSearch] = useState("");
  const [size, setSize] = useState("");
  const [shedding, setShedding] = useState("");
  const [space, setSpace] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBreeds = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 6,
        ...(search && { search }),
        ...(size && { size }),
        ...(shedding && { sheddingLevel: shedding }),
        ...(space && { spaceRequirement: space }),
      });

      const response = await fetch(
        `http://localhost:5000/api/v1/breeds?${params.toString()}`,
      );
      const json = await response.json();
      if (json.success) {
        setBreeds(json.data.breeds);
        setPagination(json.data.pagination);
      }
    } catch (err) {
      console.error("Lỗi nạp thư viện loài:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBreeds();
  }, [page, size, shedding, space]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBreeds();
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-[24px] max-w-7xl mx-auto flex flex-col md:flex-row gap-md p-md">
      {/* THANH SIDEBAR BỘ LỌC THÔNG MINH */}
      <aside className="w-full md:w-64 bg-surface-container-low p-md rounded-xl border border-outline-variant space-y-md h-fit">
        <h2 className="font-headline-md text-primary mb-xs">Filters</h2>

        <div>
          <label className="block text-label-md font-bold uppercase text-outline tracking-wider mb-xs">
            Size Group
          </label>
          <select
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg bg-white border-outline-variant text-body-sm text-on-surface p-2 focus:ring-primary"
          >
            <option value="">All Sizes</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>

        <div>
          <label className="block text-label-md font-bold uppercase text-outline tracking-wider mb-xs">
            Shedding Intensity
          </label>
          <select
            value={shedding}
            onChange={(e) => {
              setShedding(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg bg-white border-outline-variant text-body-sm text-on-surface p-2 focus:ring-primary"
          >
            <option value="">All Levels</option>
            <option value="Low">Low Shedding</option>
            <option value="Medium">Moderate</option>
            <option value="High">High Shedding</option>
          </select>
        </div>

        <div>
          <label className="block text-label-md font-bold uppercase text-outline tracking-wider mb-xs">
            Spatial Needs
          </label>
          <select
            value={space}
            onChange={(e) => {
              setSpace(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg bg-white border-outline-variant text-body-sm text-on-surface p-2 focus:ring-primary"
          >
            <option value="">All Spaces</option>
            <option value="Apartment">Apartment Friendly</option>
            <option value="Small Yard">Small Yard</option>
            <option value="Large Yard">Large Yard</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSize("");
            setShedding("");
            setSpace("");
            setSearch("");
            setPage(1);
          }}
          className="w-full py-2 border border-coral text-coral rounded-lg text-label-md font-bold hover:bg-tertiary-fixed transition-all flex items-center justify-center gap-xs"
        >
          <span className="material-symbols-outlined text-[16px]">
            restart_alt
          </span>{" "}
          Reset Filters
        </button>
      </aside>

      {/* VÙNG CHÍNH HIỂN THỊ DANH SÁCH KHỐI LƯỚI GRID MOCK-UP */}
      <div className="flex-1 space-y-md">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            placeholder="Search across natural traits & history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-10 pr-md py-2 text-body-md focus:ring-1 focus:ring-primary focus:bg-white transition-all"
          />
        </form>

        {isLoading ? (
          <div className="text-center py-lg animate-pulse text-on-surface-variant">
            Accessing Canis Archive records...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            {breeds.map((b) => (
              <article
                key={b._id}
                onClick={() => navigate(`/breeds/${b.breedId}`)}
                className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden flex flex-col sm:flex-row h-fit sm:h-56 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <img
                  src={
                    b.thumbnail ||
                    "https://images.unsplash.com/photo-1543466835-00a7907e9de1"
                  }
                  alt={b.name}
                  className="w-full sm:w-40 h-40 sm:h-full object-cover"
                />
                <div className="p-sm flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-headline-md text-primary mb-xs">
                      {b.name}
                    </h4>
                    <p className="text-body-sm text-on-surface-variant line-clamp-3">
                      {b.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-md pt-sm border-t border-outline-variant/60 text-label-md text-on-surface-variant font-bold">
                    <span className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">
                        straighten
                      </span>
                      {b.physicalStats?.height || "N/A"}
                    </span>
                    <span className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[16px]">
                        weight
                      </span>
                      {b.physicalStats?.weight || "N/A"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* PHÂN TRANG METADATA PAGER */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-md pt-md">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-sm py-1 border rounded-lg disabled:opacity-40 text-body-sm font-bold"
            >
              Prev
            </button>
            <span className="text-body-sm text-on-surface-variant">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-sm py-1 border rounded-lg disabled:opacity-40 text-body-sm font-bold"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
