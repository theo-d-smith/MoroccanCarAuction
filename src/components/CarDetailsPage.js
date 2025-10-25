import React, { useState, useEffect } from "react";
import { Gavel, Car, CheckCircle, AlertCircle, History } from "lucide-react";
import CountdownTimer from "../components/CountdownTimer";
import InspectionPanel from "../components/InspectionPanel";
import { useAppContext } from "../context/AppContext";

/**
 * Car details page - includes InspectionPanel under general specs.
 * Adds console traces to help debug if the panel is missing.
 */
export default function CarDetailsPage() {
  const {
    selectedCar,
    setCurrentPage,
    currentUser,
    setShowAuthModal,
    setAuthMode,
    placeBid,
    bids,
    getInspectionForCar,
  } = useAppContext();

  useEffect(() => {
    console.log("[CarDetailsPage] mount selectedCar:", selectedCar);
    if (!selectedCar) {
      setCurrentPage("home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCar]);

  // Keep bid amount in sync when selectedCar changes
  const [bidAmount, setBidAmount] = useState(() =>
    selectedCar ? selectedCar.currentBid + 50 : 0
  );
  useEffect(() => {
    if (selectedCar) setBidAmount(selectedCar.currentBid + 50);
  }, [selectedCar]);

  if (!selectedCar) return null;

  // ensure inspection object is present; prefer context helper
  let inspection = selectedCar.inspection;
  try {
    if (typeof getInspectionForCar === "function") {
      const maybe = getInspectionForCar(selectedCar.id);
      if (maybe) inspection = maybe;
    }
  } catch (err) {
    console.error("[CarDetailsPage] getInspectionForCar error:", err);
  }

  const carForInspection = { ...selectedCar, inspection };

  const carBids = bids[selectedCar.id] || [];

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => {
            setCurrentPage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-amber-500 hover:text-amber-400 mb-6 flex items-center gap-2"
        >
          ← Back to Auctions
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={selectedCar.images?.[0] || ""}
              alt={`${selectedCar.year} ${selectedCar.make} ${selectedCar.model}`}
              className="w-full h-96 object-cover rounded-lg mb-4"
            />

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Car className="w-6 h-6 text-amber-500" />
                Vehicle Details
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Make</p>
                  <p className="text-white font-semibold">{selectedCar.make}</p>
                </div>
                <div>
                  <p className="text-gray-400">Model</p>
                  <p className="text-white font-semibold">
                    {selectedCar.model}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Year</p>
                  <p className="text-white font-semibold">{selectedCar.year}</p>
                </div>
                <div>
                  <p className="text-gray-400">Mileage</p>
                  <p className="text-white font-semibold">
                    {selectedCar.mileage?.toLocaleString()} mi
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">VIN</p>
                  <p className="text-white font-semibold">{selectedCar.vin}</p>
                </div>
                <div>
                  <p className="text-gray-400">Condition</p>
                  <p className="text-white font-semibold">
                    {selectedCar.condition}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  {selectedCar.carfaxVerified ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  )}
                  <span className="text-white font-semibold">
                    {selectedCar.carfaxVerified
                      ? "CARFAX Verified"
                      : "Pending CARFAX Verification"}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {selectedCar.description}
                </p>
              </div>
            </div>

            {/* Always render InspectionPanel and pass canonical inspection */}
            <InspectionPanel car={carForInspection} />
          </div>

          <div>
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {selectedCar.year} {selectedCar.make} {selectedCar.model}
              </h2>
              <p className="text-gray-400 mb-6">
                Seller: {selectedCar.sellerName}
              </p>

              <div className="bg-gray-900 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Current Bid</p>
                    <p className="text-4xl font-bold text-amber-500">
                      ${selectedCar.currentBid?.toLocaleString()}
                    </p>
                  </div>
                  <CountdownTimer endTime={selectedCar.endTime} />
                </div>

                <div className="flex items-center gap-2 text-sm">
                  {selectedCar.currentBid >= selectedCar.reservePrice ? (
                    <span className="text-green-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Reserve Price Met
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      Reserve: ${selectedCar.reservePrice?.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {currentUser ? (
                selectedCar.sellerId === currentUser.email ? (
                  <div className="bg-yellow-900 bg-opacity-30 border border-yellow-500 rounded-lg p-4 text-yellow-200 text-center">
                    This is your listing. You cannot bid on your own vehicle.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">
                        Your Bid Amount ($50 increments)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(Number(e.target.value))}
                          step="50"
                          min={selectedCar.currentBid + 50}
                          className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg"
                        />
                        <button
                          onClick={() => {
                            if (
                              bidAmount >= selectedCar.currentBid + 50 &&
                              bidAmount % 50 === 0
                            ) {
                              placeBid(selectedCar.id, bidAmount);
                              setBidAmount(bidAmount + 50);
                            } else {
                              alert(
                                "Bid must be at least $50 more and in $50 increments"
                              );
                            }
                          }}
                          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition flex items-center gap-2"
                        >
                          <Gavel className="w-5 h-5" /> Place Bid
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-gray-700 rounded-lg p-6 text-center">
                  <p className="text-gray-300 mb-4">Login to place a bid</p>
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setShowAuthModal(true);
                    }}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
                  >
                    Login / Register
                  </button>
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <History className="w-6 h-6 text-amber-500" /> Bid History
              </h3>
              {carBids.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No bids yet</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {carBids
                    .slice()
                    .reverse()
                    .map((bid, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-700 rounded"
                      >
                        <div>
                          <p className="text-white font-semibold">
                            {bid.userName}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {new Date(bid.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-amber-500 font-bold">
                          ${bid.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
