import React from "react";
import { Gavel, User, Plus, Menu, Heart } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function Header() {
  const {
    setCurrentPage,
    currentUser,
    setShowAuthModal,
    setAuthMode,
    isAdmin,
    favorites,
    mobileMenuOpen,
    setMobileMenuOpen,
    handleLogout,
  } = useAppContext();

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setCurrentPage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <Gavel className="w-8 h-8 text-amber-500" />
            <span className="text-2xl font-bold text-white">LuxeAuction</span>
          </button>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentPage("home")}
              className="hidden md:block text-gray-300 hover:text-white transition"
            >
              Auctions
            </button>

            <button
              onClick={() => {
                setCurrentPage("favorites");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hidden md:flex items-center gap-2 text-gray-300 hover:text-white transition"
            >
              <Heart className="w-5 h-5 text-amber-500" />
              Watchlist
              {favorites.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-amber-500 text-white rounded-full text-xs font-semibold">
                  {favorites.length}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="hidden md:flex items-center gap-6">
                {isAdmin && (
                  <button
                    onClick={() => setCurrentPage("admin")}
                    className="text-amber-400 hover:text-amber-300 transition font-medium"
                  >
                    Admin Panel
                  </button>
                )}
                {currentUser.isSeller && !isAdmin && (
                  <button
                    onClick={() => setCurrentPage("seller")}
                    className="text-gray-300 hover:text-white transition"
                  >
                    Seller Dashboard
                  </button>
                )}
                <button
                  onClick={() => setCurrentPage("profile")}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition"
                >
                  <User className="w-5 h-5" />
                  {currentUser.name}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setShowAuthModal(true);
                }}
                className="hidden md:block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg"
              >
                Login / Register
              </button>
            )}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
