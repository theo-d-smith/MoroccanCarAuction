import React from "react";
import { CheckCircle } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { useAppContext } from "../context/AppContext";

/**
 * CarCard - displays a single car summary; supports favorite toggle and click-to-open.
 * Uses selectCarForDetails if provided by context, otherwise falls back to onClick prop / setSelectedCar.
 */
export default function CarCard({ car, onClick }) {
  const {
    isFavorited,
    toggleFavorite,
    selectCarForDetails,
    setSelectedCar,
    setCurrentPage,
  } = useAppContext();
  const isReserveMet = car.currentBid >= car.reservePrice;

  const handleOpen = () => {
    if (typeof selectCarForDetails === "function") {
      selectCarForDetails(car);
    } else if (typeof onClick === "function") {
      onClick();
    } else {
      // fallback to previous behavior if context helper not available
      setSelectedCar(car);
      setCurrentPage("details");
    }
  };

  return (
    <div
      onClick={handleOpen}
      className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 ring-amber-500 transition cursor-pointer"
    >
      <div className="relative h-48 bg-gray-700">
        <img
          src={car.images[0]}
          alt={`${car.year} ${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
        {car.carfaxVerified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            CARFAX
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(car.id);
          }}
          className="absolute top-3 left-3 bg-gray-900 bg-opacity-60 p-2 rounded-full text-amber-400 hover:text-white"
          title={
            isFavorited(car.id) ? "Remove from Watchlist" : "Add to Watchlist"
          }
        >
          <svg
            className={`w-5 h-5 ${isFavorited(car.id) ? "text-red-400" : ""}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.5 2.09C12.09 5 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2">
          {car.year} {car.make} {car.model}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <span>{car.mileage.toLocaleString()} mi</span>
          <span>•</span>
          <span>VIN: {car.vin.slice(-6)}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-gray-400 text-sm">Current Bid</p>
            <p className="text-2xl font-bold text-amber-500">
              ${car.currentBid.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            {isReserveMet ? (
              <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Reserve Met
              </span>
            ) : (
              <span className="text-gray-400 text-sm">
                Reserve: ${car.reservePrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="pt-3 border-t border-gray-700">
          <CountdownTimer endTime={car.endTime} />
        </div>
      </div>
    </div>
  );
}
