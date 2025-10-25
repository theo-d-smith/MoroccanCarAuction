import React from "react";
import { User, History } from "lucide-react";
import { useAppContext } from "../context/AppContext";

/**
 * Profile page - user info + bid history
 */
export default function ProfilePage() {
  const { currentUser, bids, cars } = useAppContext();

  const userBids = Object.entries(bids)
    .flatMap(([carId, carBids]) =>
      carBids
        .filter((bid) => bid.userId === currentUser?.email)
        .map((bid) => ({ ...bid, car: cars.find((c) => c.id === carId) }))
    )
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {currentUser?.name}
              </h1>
              <p className="text-gray-400">{currentUser?.email}</p>
              {currentUser?.isSeller && (
                <span className="inline-block mt-2 px-3 py-1 bg-amber-500 bg-opacity-20 text-amber-400 rounded-full text-sm font-semibold">
                  Verified Seller
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <History className="w-6 h-6 text-amber-500" />
            Your Bid History
          </h2>

          {userBids.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No bids placed yet</p>
          ) : (
            <div className="space-y-4">
              {userBids.map((bid, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={bid.car?.images[0]}
                      alt="Car"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-white font-semibold">
                        {bid.car?.year} {bid.car?.make} {bid.car?.model}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(bid.timestamp).toLocaleString()}
                      </p>
                      {bid.car && bid.amount === bid.car.currentBid && (
                        <span className="inline-block mt-1 px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded text-xs font-semibold">
                          Leading Bid
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-500">
                      ${bid.amount.toLocaleString()}
                    </p>
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
