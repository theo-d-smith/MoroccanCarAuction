import React from "react";
import { X } from "lucide-react";
import { useAppContext } from "../context/AppContext";

/**
 * Renders pinned active filter chips using canonical filters from context.
 */
export default function ActiveFilterChips() {
  const { filters, clearFilterField, setShowFilters } = useAppContext();

  const chips = [];
  if (filters.search)
    chips.push({ key: "search", label: `Search: ${filters.search}` });
  if (filters.make) chips.push({ key: "make", label: `Make: ${filters.make}` });
  if (filters.model)
    chips.push({ key: "model", label: `Model: ${filters.model}` });
  if (filters.condition)
    chips.push({ key: "condition", label: `Condition: ${filters.condition}` });
  if (filters.yearMin)
    chips.push({ key: "yearMin", label: `Year ≥ ${filters.yearMin}` });
  if (filters.yearMax)
    chips.push({ key: "yearMax", label: `Year ≤ ${filters.yearMax}` });
  if (filters.priceMin)
    chips.push({
      key: "priceMin",
      label: `Price ≥ $${Number(filters.priceMin).toLocaleString()}`,
    });
  if (filters.priceMax)
    chips.push({
      key: "priceMax",
      label: `Price ≤ $${Number(filters.priceMax).toLocaleString()}`,
    });
  if (filters.mileageMax)
    chips.push({
      key: "mileageMax",
      label: `Mileage ≤ ${Number(filters.mileageMax).toLocaleString()} mi`,
    });
  if (filters.carfaxVerified)
    chips.push({ key: "carfaxVerified", label: `CARFAX Verified` });
  if (filters.reserveMet)
    chips.push({ key: "reserveMet", label: `Reserve Met` });

  if (chips.length === 0) return null;

  return (
    <div className="sticky top-20 z-30 bg-gradient-to-b from-gray-900/80 to-transparent px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-400 mr-2">Active Filters:</span>
        {chips.map((chip) => (
          <div
            key={chip.key}
            className="flex items-center bg-gray-800 text-white rounded-full px-3 py-1 text-sm shadow-sm"
          >
            <span className="mr-2">{chip.label}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilterField(chip.key);
                setShowFilters(true);
              }}
              className="rounded-full p-1 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label={`Remove filter ${chip.label}`}
              title={`Remove ${chip.label}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            clearFilterField &&
              clearFilterField("search"); /* noop to keep API similar */
          }}
          className="ml-3 px-3 py-1 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
