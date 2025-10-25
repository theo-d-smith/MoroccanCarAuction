import React, { useEffect, useRef, useState } from "react";
import { Search, Filter } from "lucide-react";
import { useAppContext } from "../context/AppContext";

/**
 * FilterPanel - focuses input when canonical filters update; replaced saved-search input
 * with a Save Current Filters flow (opens inline prompt).
 */
export default React.memo(function FilterPanel({
  showFilters,
  setShowFilters,
}) {
  const {
    filters,
    setFilters,
    defaultFilters,
    savedSearches,
    saveSearch,
    deleteSavedSearch,
    loadSavedSearch,
    filterCars,
    cars,
  } = useAppContext();

  const [localFilters, setLocalFilters] = useState(filters);
  const debounceRef = useRef(null);
  const searchRef = useRef(null);

  // track if search input currently focused so we can restore focus after updates
  const isSearchFocusedRef = useRef(false);

  useEffect(() => setLocalFilters(filters), [filters]);

  useEffect(() => {
    // if canonical filters change while the search input was focused, keep focus
    if (isSearchFocusedRef.current) {
      searchRef.current?.focus?.({ preventScroll: true });
    }
  }, [filters]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => {
        const changed = JSON.stringify(prev) !== JSON.stringify(localFilters);
        return changed ? { ...localFilters } : prev;
      });
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [localFilters, setFilters]);

  const onLocalChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Saved-search UI change:
  // Instead of always showing a name input, show a "Save Current Filters" button that opens a small inline prompt.
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [saveName, setSaveName] = useState("");

  const handleSaveCurrent = () => {
    const name = saveName.trim();
    if (!name) {
      alert("Please enter a name for the saved filters");
      return;
    }
    saveSearch(name, localFilters);
    setSaveName("");
    setShowSavePrompt(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-white">Search & Filter</h3>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-amber-500 hover:text-amber-400 flex items-center gap-2"
          aria-expanded={showFilters}
        >
          <Filter className="w-5 h-5" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Search input (local) */}
      <div className="mb-4">
        <input
          ref={searchRef}
          id="filter-search"
          type="text"
          placeholder="Search by make, model, VIN, seller, or keyword..."
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          value={localFilters.search}
          onChange={(e) => onLocalChange("search", e.target.value)}
          aria-label="Search auctions"
          onFocus={() => {
            isSearchFocusedRef.current = true;
          }}
          onBlur={() => {
            // don't immediately clear; keep flag until next render updates focus if needed
            isSearchFocusedRef.current = false;
          }}
        />
      </div>

      {/* Save Current Filters button + prompt */}
      <div className="mb-4 flex items-center gap-3">
        {!showSavePrompt ? (
          <button
            onClick={() => setShowSavePrompt(true)}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
          >
            Save Current Filters
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Name"
              className="px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
            />
            <button
              onClick={handleSaveCurrent}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setShowSavePrompt(false)}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="ml-auto text-sm text-gray-400">
          {filterCars(cars).length} shown
        </div>
      </div>

      {/* Saved searches listing */}
      {savedSearches.length > 0 && (
        <div className="mb-4 space-y-2">
          {savedSearches.map((s) => (
            <div
              key={s.name}
              className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded"
            >
              <div className="flex-1 text-white">{s.name}</div>
              <button
                onClick={() => loadSavedSearch(s)}
                className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-sm"
              >
                Load
              </button>
              <button
                onClick={() => deleteSavedSearch(s.name)}
                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Advanced filters */}
      {showFilters && (
        <div className="space-y-4 border-t border-gray-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Make</label>
              <input
                type="text"
                placeholder="e.g., Porsche"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                value={localFilters.make}
                onChange={(e) => onLocalChange("make", e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Model</label>
              <input
                type="text"
                placeholder="e.g., 911"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                value={localFilters.model}
                onChange={(e) => onLocalChange("model", e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Condition
              </label>
              <select
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                value={localFilters.condition}
                onChange={(e) => onLocalChange("condition", e.target.value)}
              >
                <option value="">Any</option>
                <option>Excellent</option>
                <option>Very Good</option>
                <option>Good</option>
                <option>Fair</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Year Min
              </label>
              <input
                type="number"
                placeholder="e.g., 2020"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                value={localFilters.yearMin}
                onChange={(e) => onLocalChange("yearMin", e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Year Max
              </label>
              <input
                type="number"
                placeholder="e.g., 2024"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                value={localFilters.yearMax}
                onChange={(e) => onLocalChange("yearMax", e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Max Mileage
              </label>
              <input
                type="number"
                placeholder="e.g., 50000"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                value={localFilters.mileageMax}
                onChange={(e) => onLocalChange("mileageMax", e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Price Min
              </label>
              <input
                type="number"
                placeholder="e.g., 50000"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                value={localFilters.priceMin}
                onChange={(e) => onLocalChange("priceMin", e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Price Max
              </label>
              <input
                type="number"
                placeholder="e.g., 150000"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                value={localFilters.priceMax}
                onChange={(e) => onLocalChange("priceMax", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={localFilters.carfaxVerified}
                onChange={(e) =>
                  onLocalChange("carfaxVerified", e.target.checked)
                }
              />
              <span>CARFAX Verified Only</span>
            </label>

            <label className="flex items-center gap-2 text-white cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5"
                checked={localFilters.reserveMet}
                onChange={(e) => onLocalChange("reserveMet", e.target.checked)}
              />
              <span>Reserve Met Only</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                const empty = { ...defaultFilters };
                setLocalFilters(empty);
                setFilters(empty);
                setShowFilters(true);
                setTimeout(() => searchRef.current?.focus?.(), 0);
              }}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Clear Filters
            </button>

            <div className="text-gray-400 flex items-center">
              <span className="text-sm">
                Showing {filterCars(cars).length} of {cars.length} listings
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
