import React from "react";
import { Heart } from "lucide-react";
import CarCard from "../components/CarCard";
import { useAppContext } from "../context/AppContext";

/**
 * Watchlist / Favorites page
 */
export default function FavoritesPage() {
  const { cars, favorites, setSelectedCar, setCurrentPage, toggleFavorite } =
    useAppContext();
  const myFavorites = cars.filter((c) => favorites.includes(c.id));

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Your Watchlist</h1>
          <div className="text-gray-400">{myFavorites.length} saved</div>
        </div>

        {myFavorites.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No saved vehicles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myFavorites.map((car) => (
              <div key={car.id}>
                <CarCard
                  car={car}
                  onClick={() => {
                    setSelectedCar(car);
                    setCurrentPage("details");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => toggleFavorite(car.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCar(car);
                      setCurrentPage("details");
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    View Auction
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
