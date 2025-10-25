import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import FilterPanel from "../components/FilterPanel";
import ActiveFilterChips from "../components/ActiveFilterChips";
import CarCard from "../components/CarCard";
import { useAppContext } from "../context/AppContext";

/**
 * Home page - shows header hero, filter panel, and grid of car cards.
 */
export default function HomePage() {
  const {
    cars,
    filterCars,
    sortBy,
    applySort,
    showFilters,
    setShowFilters,
    setSelectedCar,
    setCurrentPage,
  } = useAppContext();

  const filteredAndSorted = useMemo(
    () => applySort(filterCars(cars), sortBy),
    [cars, sortBy, filterCars, applySort]
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Premium Automotive Auctions
          </h1>
          <p className="text-xl text-gray-300">
            Bid on the world's finest vehicles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="pt-8">
          <FilterPanel
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        </div>

        <ActiveFilterChips />

        <div className="px-0 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Live Auctions</h2>
            <div className="flex items-center gap-2 text-gray-400">
              <TrendingUp className="w-5 h-5" />
              <span>{filteredAndSorted.length} Active</span>
            </div>
          </div>

          {filteredAndSorted.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                No auctions match your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSorted.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onClick={() => {
                    setSelectedCar(car);
                    setCurrentPage("details");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
