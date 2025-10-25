import React, { useMemo, useState } from "react";
import { CheckCircle, Download } from "lucide-react";
import FilterPanel from "../components/FilterPanel";
import ActiveFilterChips from "../components/ActiveFilterChips";
import { useAppContext } from "../context/AppContext";

/**
 * AdminPanel - shows metrics and listing management; also CSV export buttons are supplied from context.
 */
export default function AdminPanel() {
  const {
    cars,
    bids,
    filterCars,
    applySort,
    sortBy,
    showFilters,
    setShowFilters,
    exportListingsCSV,
    exportBidsCSV,
    updateListing,
    deleteListing,
  } = useAppContext();

  const filteredCars = useMemo(
    () => applySort(filterCars(cars), sortBy),
    [cars, sortBy, filterCars, applySort]
  );

  const totalUsers = Object.keys(bids).reduce((acc, carId) => {
    (bids[carId] || []).forEach((bid) => acc.add(bid.userId));
    return acc;
  }, new Set()).size;

  const totalBids = Object.values(bids).reduce(
    (sum, carBids) => sum + carBids.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Admin Control Panel
            </h1>
            <p className="text-gray-400 mt-1">
              Manage all listings and platform settings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
              <span className="text-red-400 font-semibold">ADMIN ACCESS</span>
            </div>
            <button
              onClick={exportListingsCSV}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Listings
            </button>
            <button
              onClick={exportBidsCSV}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Bids
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Total Listings</h3>
            <p className="text-4xl font-bold text-white">{cars.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Total Bids</h3>
            <p className="text-4xl font-bold text-amber-500">{totalBids}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Active Bidders</h3>
            <p className="text-4xl font-bold text-green-500">{totalUsers}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Total Value</h3>
            <p className="text-4xl font-bold text-purple-500">
              $
              {(cars.reduce((sum, c) => sum + c.currentBid, 0) / 1000).toFixed(
                0
              )}
              K
            </p>
          </div>
        </div>

        <FilterPanel
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        <ActiveFilterChips />

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            All Auction Listings ({filteredCars.length} of {cars.length})
          </h2>

          {filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">
                {cars.length === 0
                  ? "No listings yet"
                  : "No listings match your filters"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCars.map((car) => (
                <div key={car.id} className="bg-gray-700 rounded-lg p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <img
                      src={car.images[0]}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      className="w-full lg:w-48 h-32 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {car.year} {car.make} {car.model}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            VIN: {car.vin}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Seller: {car.sellerName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {car.carfaxVerified && (
                            <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full text-xs font-semibold">
                              CARFAX ✓
                            </span>
                          )}
                          {car.currentBid >= car.reservePrice && (
                            <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full text-xs font-semibold">
                              Reserve Met
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Current Bid</p>
                          <p className="text-lg font-bold text-amber-500">
                            ${car.currentBid.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Reserve</p>
                          <p className="text-lg font-bold text-white">
                            ${car.reservePrice.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Mileage</p>
                          <p className="text-lg font-bold text-white">
                            {car.mileage.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Total Bids</p>
                          <p className="text-lg font-bold text-white">
                            {(bids[car.id] || []).length}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Time Left</p>
                          <span className="text-white">—</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            updateListing(car.id, {
                              carfaxVerified: !car.carfaxVerified,
                            })
                          }
                          className={`px-4 py-2 ${
                            car.carfaxVerified ? "bg-gray-600" : "bg-green-500"
                          } hover:opacity-80 text-white rounded-lg transition text-sm font-semibold`}
                        >
                          {car.carfaxVerified
                            ? "Unverify CARFAX"
                            : "Verify CARFAX"}
                        </button>
                        <button
                          onClick={() => deleteListing(car.id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
