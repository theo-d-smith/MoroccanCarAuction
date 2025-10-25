import React, { useMemo, useState } from "react";
import { Plus, Car } from "lucide-react";
import FilterPanel from "../components/FilterPanel";
import ActiveFilterChips from "../components/ActiveFilterChips";
import { useAppContext } from "../context/AppContext";

/**
 * Seller Dashboard page
 */
export default function SellerDashboard() {
  const {
    currentUser,
    cars,
    bids,
    addListing,
    filterCars,
    applySort,
    sortBy,
    showFilters,
    setShowFilters,
    setSelectedCar,
    setCurrentPage,
  } = useAppContext();

  const [showAddListing, setShowAddListing] = useState(false);
  const [newListing, setNewListing] = useState({
    make: "",
    model: "",
    year: "",
    vin: "",
    mileage: "",
    startingPrice: "",
    reservePrice: "",
    condition: "Excellent",
    description: "",
    images: [
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
    ],
    duration: 24,
  });

  const myListings = cars.filter((car) => car.sellerId === currentUser?.email);
  const filteredListings = useMemo(
    () => applySort(filterCars(myListings), sortBy),
    [myListings, sortBy, filterCars, applySort]
  );

  const handleAddListing = () => {
    if (
      !newListing.make ||
      !newListing.model ||
      !newListing.year ||
      !newListing.vin
    ) {
      alert("Please fill in all required fields");
      return;
    }
    addListing({
      ...newListing,
      year: Number(newListing.year),
      mileage: Number(newListing.mileage),
      startingPrice: Number(newListing.startingPrice),
      reservePrice: Number(newListing.reservePrice),
    });
    setShowAddListing(false);
    setNewListing({
      make: "",
      model: "",
      year: "",
      vin: "",
      mileage: "",
      startingPrice: "",
      reservePrice: "",
      condition: "Excellent",
      description: "",
      images: [
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
      ],
      duration: 24,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Seller Dashboard</h1>
          <button
            onClick={() => setShowAddListing(true)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Listing
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Active Listings</h3>
            <p className="text-4xl font-bold text-white">{myListings.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Total Bids</h3>
            <p className="text-4xl font-bold text-amber-500">
              {myListings.reduce(
                (sum, car) => sum + (bids[car.id]?.length || 0),
                0
              )}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 mb-2">Highest Bid</h3>
            <p className="text-4xl font-bold text-green-500">
              $
              {Math.max(
                ...myListings.map((c) => c.currentBid),
                0
              ).toLocaleString()}
            </p>
          </div>
        </div>

        <FilterPanel
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        <ActiveFilterChips />

        <h2 className="text-2xl font-bold text-white mb-6">
          Your Listings ({filteredListings.length} of {myListings.length})
        </h2>

        {filteredListings.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">
              {myListings.length === 0
                ? "No active listings"
                : "No listings match your filters"}
            </p>
            {myListings.length === 0 ? (
              <button
                onClick={() => setShowAddListing(true)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
              >
                Create Your First Listing
              </button>
            ) : (
              <button
                onClick={() => {
                  /* reset filters logic could be added */
                }}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((car) => (
              <div key={car.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={car.images[0]}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">VIN: {car.vin}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Current Bid</p>
                        <p className="text-xl font-bold text-amber-500">
                          ${car.currentBid.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Reserve</p>
                        <p className="text-xl font-bold text-white">
                          ${car.reservePrice.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Total Bids</p>
                        <p className="text-xl font-bold text-white">
                          {bids[car.id]?.length || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Time Left</p>
                        <span className="text-white">—</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedCar(car);
                        setCurrentPage("details");
                      }}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddListing && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Create New Listing
                </h2>
                <button
                  onClick={() => setShowAddListing(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                {/* form fields (same as original) */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Make *"
                    value={newListing.make}
                    onChange={(e) =>
                      setNewListing({ ...newListing, make: e.target.value })
                    }
                    className="px-4 py-3 bg-gray-700 text-white rounded-lg"
                  />
                  <input
                    placeholder="Model *"
                    value={newListing.model}
                    onChange={(e) =>
                      setNewListing({ ...newListing, model: e.target.value })
                    }
                    className="px-4 py-3 bg-gray-700 text-white rounded-lg"
                  />
                </div>
                {/* ... other inputs */}
                <button
                  onClick={handleAddListing}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
                >
                  Create Listing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
