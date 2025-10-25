import React from "react";
import { AppProvider } from "./context/AppContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CarDetailsPage from "./pages/CarDetailsPage";
import SellerDashboard from "./pages/SellerDashboard";
import AdminPanel from "./pages/AdminPanel";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import AuthModal from "./components/AuthModal";
import { useAppContext } from "./context/AppContext";
import ErrorBoundary from "./components/ErrorBoundary";

/**
 * App.js - lightweight assembly: provider + header + pages + error boundary
 */
function AppInner() {
  const {
    loading,
    currentPage,
    selectedCar,
    showAuthModal,
    isAdmin,
    currentUser,
  } = useAppContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse">
            ⚒️
          </div>
          <p className="text-white text-xl">Loading LuxeAuction...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      {currentPage === "home" && <HomePage />}
      {currentPage === "details" && selectedCar && <CarDetailsPage />}
      {currentPage === "favorites" && <FavoritesPage />}
      {currentPage === "seller" && currentUser?.isSeller && !isAdmin && (
        <SellerDashboard />
      )}
      {currentPage === "profile" && currentUser && <ProfilePage />}
      {currentPage === "admin" && isAdmin && <AdminPanel />}
      {showAuthModal && <AuthModal />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppInner />
      </ErrorBoundary>
    </AppProvider>
  );
}
