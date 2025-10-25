import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  getFiltersFromUrlOrStorage,
  saveFiltersToStorageAndUrl,
  loadPerOwnerSavedSearches,
  savePerOwnerSavedSearches,
  loadPerOwnerFavorites,
  savePerOwnerFavorites,
} from "../utils/storage";

/**
 * AppContext - central global state with inspection normalization so each listing
 * always includes the inspection structure required by the InspectionPanel.
 */

const AppContext = createContext(null);
export const useAppContext = () => useContext(AppContext);

export function AppProvider({ children }) {
  // Global UI State
  const [currentPage, setCurrentPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [bids, setBids] = useState({});
  const [users, setUsers] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Filter panel visible
  const [showFilters, setShowFilters] = useState(false);

  const defaultFilters = {
    search: "",
    make: "",
    model: "",
    yearMin: "",
    yearMax: "",
    priceMin: "",
    priceMax: "",
    mileageMax: "",
    condition: "",
    carfaxVerified: false,
    reserveMet: false,
  };
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState("timeLeft");
  const [favorites, setFavorites] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);

  const ADMIN_EMAIL = "admin@luxeauction.com";
  const ADMIN_PASSWORD = "admin123";

  // storage owner (per-user or guest)
  const currentStorageOwner = useMemo(
    () => (currentUser && currentUser.email ? currentUser.email : "guest"),
    [currentUser]
  );

  // Helper: ensure a car object has the inspection structure
  const normalizeCarInspection = (car) => {
    if (!car) return car;
    const inspection = car.inspection || {};
    return {
      ...car,
      inspection: {
        frontLeft: Array.isArray(inspection.frontLeft)
          ? inspection.frontLeft
          : [],
        frontRight: Array.isArray(inspection.frontRight)
          ? inspection.frontRight
          : [],
        rearLeft: Array.isArray(inspection.rearLeft) ? inspection.rearLeft : [],
        rearRight: Array.isArray(inspection.rearRight)
          ? inspection.rearRight
          : [],
      },
    };
  };

  // sample data init (normalized)
  useEffect(() => {
    const sampleCars = [
      {
        id: "1",
        make: "Porsche",
        model: "911 Carrera",
        year: 2022,
        vin: "1HGBH41JXMN109186",
        mileage: 8500,
        startingPrice: 95000,
        reservePrice: 110000,
        currentBid: 98000,
        images: [
          "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800",
        ],
        condition: "Excellent",
        sellerId: "demo_seller",
        sellerName: "Premium Motors",
        endTime: Date.now() + 2 * 60 * 60 * 1000,
        description: "Pristine condition, single owner.",
        carfaxVerified: true,
      },
      {
        id: "2",
        make: "BMW",
        model: "M4 Competition",
        year: 2023,
        vin: "2HGES16534H504893",
        mileage: 3200,
        startingPrice: 78000,
        reservePrice: 85000,
        currentBid: 82000,
        images: [
          "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800",
        ],
        condition: "Like New",
        sellerId: "demo_seller",
        sellerName: "Luxury Auto Group",
        endTime: Date.now() + 5 * 60 * 60 * 1000,
        description: "Carbon fiber package.",
        carfaxVerified: true,
      },
      {
        id: "3",
        make: "Mercedes-Benz",
        model: "AMG GT",
        year: 2021,
        vin: "3FAHP07Z79R123456",
        mileage: 12000,
        startingPrice: 125000,
        reservePrice: 135000,
        currentBid: 128000,
        images: [
          "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
        ],
        condition: "Excellent",
        sellerId: "demo_seller2",
        sellerName: "Elite Automotive",
        endTime: Date.now() + 8 * 60 * 60 * 1000,
        description: "AMG Performance package.",
        carfaxVerified: true,
      },
    ].map(normalizeCarInspection);

    setCars(sampleCars);
    setLoading(false);
  }, []);

  // initialize filters, sort, saved searches, favorites from URL/localStorage
  useEffect(() => {
    try {
      const { filters: initialFilters, sort } =
        getFiltersFromUrlOrStorage(defaultFilters);
      if (initialFilters) setFilters(initialFilters);
      if (sort) setSortBy(sort);
    } catch (e) {
      // ignore
    }

    // load guest saved/favs (owner-specific load runs when owner changes)
    try {
      const ss = loadPerOwnerSavedSearches("guest");
      setSavedSearches(ss || []);
    } catch {}
    try {
      const fav = loadPerOwnerFavorites("guest");
      setFavorites(fav || []);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When owner changes (login/logout) load their saved searches / favorites
  useEffect(() => {
    try {
      const ss = loadPerOwnerSavedSearches(currentStorageOwner);
      setSavedSearches(ss || []);
    } catch {
      setSavedSearches([]);
    }
    try {
      const fav = loadPerOwnerFavorites(currentStorageOwner);
      setFavorites(fav || []);
    } catch {
      setFavorites([]);
    }
  }, [currentStorageOwner]);

  // persist filters & sort to URL + localStorage (debounced)
  const persistRef = useRef(null);
  useEffect(() => {
    if (persistRef.current) clearTimeout(persistRef.current);
    persistRef.current = setTimeout(() => {
      try {
        saveFiltersToStorageAndUrl(filters);
      } catch (e) {
        // ignore
      }
    }, 350);
    return () => {
      if (persistRef.current) clearTimeout(persistRef.current);
    };
  }, [filters]);

  useEffect(() => {
    try {
      localStorage.setItem("luxe_sort_v1", sortBy);
    } catch {}
  }, [sortBy]);

  // ----------
  // Auth / Users
  // ----------
  const handleLogin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setCurrentUser({
        email: ADMIN_EMAIL,
        name: "Administrator",
        isSeller: true,
        isAdmin: true,
      });
      setIsAdmin(true);
      setShowAuthModal(false);
      return true;
    }
    if (users[email]?.password === password) {
      setCurrentUser({ ...users[email], email, isAdmin: false });
      setIsAdmin(false);
      setShowAuthModal(false);
      return true;
    }
    return false;
  };

  const handleRegister = (email, password, name, isSeller) => {
    if (users[email]) return false;
    const newUsers = { ...users, [email]: { password, name, isSeller } };
    setUsers(newUsers);
    setCurrentUser({ ...newUsers[email], email, isAdmin: false });
    setShowAuthModal(false);
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setCurrentPage("home");
  };

  // ----------
  // Listings / Bids
  // ----------
  const placeBid = (carId, amount) => {
    if (!currentUser) return;
    const car = cars.find((c) => c.id === carId);
    if (!car) return;
    if (car.sellerId === currentUser.email) {
      alert("You cannot bid on your own listing!");
      return;
    }
    setCars((prev) =>
      prev.map((c) =>
        c.id === carId && amount >= c.currentBid + 50
          ? { ...c, currentBid: amount }
          : c
      )
    );
    setBids((prev) => {
      const newBids = { ...prev };
      if (!newBids[carId]) newBids[carId] = [];
      newBids[carId].push({
        userId: currentUser.email,
        userName: currentUser.name,
        amount,
        timestamp: Date.now(),
      });
      return newBids;
    });
  };

  const addListing = (listing) => {
    const newCar = {
      ...listing,
      id: Date.now().toString(),
      sellerId: currentUser.email,
      sellerName: currentUser.name,
      currentBid: listing.startingPrice,
      endTime: Date.now() + listing.duration * 60 * 60 * 1000,
      carfaxVerified: false,
      inspection: {
        frontLeft: [],
        frontRight: [],
        rearLeft: [],
        rearRight: [],
      },
    };
    setCars((prev) => [...prev, normalizeCarInspection(newCar)]);
  };

  const updateListing = (carId, updates) => {
    setCars((prev) =>
      prev.map((c) =>
        c.id === carId ? normalizeCarInspection({ ...c, ...updates }) : c
      )
    );
  };

  const deleteListing = (carId) => {
    setCars((prev) => prev.filter((c) => c.id !== carId));
    setBids((prev) => {
      const copy = { ...prev };
      delete copy[carId];
      return copy;
    });
    // remove favorites referencing it
    setFavorites((prev) => {
      const updated = prev.filter((id) => id !== carId);
      try {
        savePerOwnerFavorites(currentStorageOwner, updated);
      } catch {}
      return updated;
    });
  };

  // ----------
  // Filters
  // ----------
  const filterCars = (carsList, canonicalFilters = filters) => {
    return carsList.filter((car) => {
      if (canonicalFilters.search) {
        const s = canonicalFilters.search.toLowerCase();
        const matches =
          car.make.toLowerCase().includes(s) ||
          car.model.toLowerCase().includes(s) ||
          car.vin.toLowerCase().includes(s) ||
          (car.description || "").toLowerCase().includes(s) ||
          car.sellerName.toLowerCase().includes(s) ||
          car.year.toString().includes(s);
        if (!matches) return false;
      }
      if (
        canonicalFilters.make &&
        !car.make.toLowerCase().includes(canonicalFilters.make.toLowerCase())
      )
        return false;
      if (
        canonicalFilters.model &&
        !car.model.toLowerCase().includes(canonicalFilters.model.toLowerCase())
      )
        return false;
      if (
        canonicalFilters.yearMin &&
        car.year < parseInt(canonicalFilters.yearMin)
      )
        return false;
      if (
        canonicalFilters.yearMax &&
        car.year > parseInt(canonicalFilters.yearMax)
      )
        return false;
      if (
        canonicalFilters.priceMin &&
        car.currentBid < parseInt(canonicalFilters.priceMin)
      )
        return false;
      if (
        canonicalFilters.priceMax &&
        car.currentBid > parseInt(canonicalFilters.priceMax)
      )
        return false;
      if (
        canonicalFilters.mileageMax &&
        car.mileage > parseInt(canonicalFilters.mileageMax)
      )
        return false;
      if (
        canonicalFilters.condition &&
        car.condition !== canonicalFilters.condition
      )
        return false;
      if (canonicalFilters.carfaxVerified && !car.carfaxVerified) return false;
      if (canonicalFilters.reserveMet && car.currentBid < car.reservePrice)
        return false;
      return true;
    });
  };

  const resetFilters = () => setFilters(defaultFilters);

  const clearFilterField = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: typeof prev[key] === "boolean" ? false : "",
    }));
    setShowFilters(true);
  };

  // ----------
  // Favorites
  // ----------
  const toggleFavorite = (carId) => {
    setFavorites((prev) => {
      const exists = prev.includes(carId);
      const updated = exists
        ? prev.filter((id) => id !== carId)
        : [...prev, carId];
      try {
        savePerOwnerFavorites(currentStorageOwner, updated);
      } catch {}
      return updated;
    });
  };
  const isFavorited = (carId) => favorites.includes(carId);

  // ----------
  // Saved searches
  // ----------
  const saveSearch = (name, filtersToSave) => {
    const updated = [
      ...savedSearches.filter((s) => s.name !== name),
      { name, filters: filtersToSave },
    ];
    setSavedSearches(updated);
    try {
      savePerOwnerSavedSearches(currentStorageOwner, updated);
    } catch {}
  };
  const deleteSavedSearch = (name) => {
    const updated = savedSearches.filter((s) => s.name !== name);
    setSavedSearches(updated);
    try {
      savePerOwnerSavedSearches(currentStorageOwner, updated);
    } catch {}
  };
  const loadSavedSearch = (s) => {
    setFilters(s.filters);
    setShowFilters(true);
  };

  // ----------
  // Sorting helper
  // ----------
  const applySort = (list, sortKey) => {
    const sorted = [...list];
    if (sortKey === "priceLow") {
      sorted.sort((a, b) => a.currentBid - b.currentBid);
    } else if (sortKey === "priceHigh") {
      sorted.sort((a, b) => b.currentBid - a.currentBid);
    } else if (sortKey === "mileage") {
      sorted.sort((a, b) => a.mileage - b.mileage);
    } else if (sortKey === "newest") {
      sorted.sort((a, b) => {
        const ai = Number(a.id);
        const bi = Number(b.id);
        if (!isNaN(ai) && !isNaN(bi)) return bi - ai;
        return b.endTime - a.endTime;
      });
    } else {
      // timeLeft
      sorted.sort((a, b) => a.endTime - Date.now() - (b.endTime - Date.now()));
    }
    return sorted;
  };

  // ----------
  // Inspection management (new)
  // ----------
  // corner keys: frontLeft, frontRight, rearLeft, rearRight
  // image object: { id, url, description, category } where category ∈ ["engine","damage","other"]
  const addInspectionImage = (carId, corner, imageObj) => {
    setCars((prev) =>
      prev.map((c) => {
        if (c.id !== carId) return c;
        const inspection = {
          ...(c.inspection || {
            frontLeft: [],
            frontRight: [],
            rearLeft: [],
            rearRight: [],
          }),
        };
        const arr = inspection[corner] ? [...inspection[corner]] : [];
        arr.push({ id: Date.now().toString(), ...imageObj });
        inspection[corner] = arr;
        return { ...c, inspection };
      })
    );
  };

  const removeInspectionImage = (carId, corner, imageId) => {
    setCars((prev) =>
      prev.map((c) => {
        if (c.id !== carId) return c;
        const inspection = { ...(c.inspection || {}) };
        inspection[corner] = (inspection[corner] || []).filter(
          (img) => img.id !== imageId
        );
        return { ...c, inspection };
      })
    );
  };

  const getInspectionForCar = (carId) => {
    const car = cars.find((c) => c.id === carId);
    return (
      car?.inspection || {
        frontLeft: [],
        frontRight: [],
        rearLeft: [],
        rearRight: [],
      }
    );
  };

  // Helper: select car for details view and ensure it's normalized
  const selectCarForDetails = (car) => {
    if (!car) {
      setSelectedCar(null);
      setCurrentPage("home");
      return;
    }
    // Ensure car in cars array is normalized; if not, normalize in state
    const hasCar = cars.some((c) => c.id === car.id);
    if (!hasCar) {
      // If car not in list (unlikely), still normalize and set
      const normalized = normalizeCarInspection(car);
      setSelectedCar(normalized);
      setCurrentPage("details");
      return;
    }
    // If it's in the array but lacking inspection, fix it
    const needsFix = cars.some(
      (c) =>
        c.id === car.id && (!c.inspection || !("frontLeft" in c.inspection))
    );
    if (needsFix) {
      setCars((prev) =>
        prev.map((c) => (c.id === car.id ? normalizeCarInspection(c) : c))
      );
    }
    const found = cars.find((c) => c.id === car.id);
    setSelectedCar(normalizeCarInspection(found));
    setCurrentPage("details");
  };

  // Ensure every car has inspection: when cars change, normalize any that lack inspection
  useEffect(() => {
    if (!cars || cars.length === 0) return;
    const needsNormalization = cars.some(
      (c) => !c.inspection || !("frontLeft" in c.inspection)
    );
    if (needsNormalization) {
      setCars((prev) => prev.map(normalizeCarInspection));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cars.length]);

  // ----------
  // CSV utilities (unchanged)
  // ----------
  const downloadCSV = (filename, csvContent) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportListingsCSV = () => {
    const header = [
      "id",
      "make",
      "model",
      "year",
      "vin",
      "mileage",
      "startingPrice",
      "reservePrice",
      "currentBid",
      "sellerId",
      "sellerName",
      "endTime",
      "carfaxVerified",
      "condition",
      "description",
    ];
    const rows = cars.map((c) =>
      header
        .map((h) => {
          const v = c[h];
          if (v === null || v === undefined) return "";
          if (typeof v === "string") return `"${v.replace(/"/g, '""')}"`;
          return `"${String(v).replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    downloadCSV(`luxe_listings_${Date.now()}.csv`, csv);
  };

  const exportBidsCSV = () => {
    const header = [
      "carId",
      "carTitle",
      "userId",
      "userName",
      "amount",
      "timestamp",
    ];
    const rows = [];
    Object.entries(bids).forEach(([carId, carBids]) => {
      const car = cars.find((c) => c.id === carId);
      const carTitle = car ? `${car.year} ${car.make} ${car.model}` : "Unknown";
      (carBids || []).forEach((bid) => {
        rows.push(
          [
            carId,
            `"${carTitle.replace(/"/g, '""')}"`,
            bid.userId,
            `"${String(bid.userName).replace(/"/g, '""')}"`,
            bid.amount,
            new Date(bid.timestamp).toISOString(),
          ].join(",")
        );
      });
    });
    const csv = [header.join(","), ...rows].join("\n");
    downloadCSV(`luxe_bids_${Date.now()}.csv`, csv);
  };

  // context value
  const value = {
    // state
    currentPage,
    setCurrentPage,
    currentUser,
    setCurrentUser,
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    selectedCar,
    setSelectedCar,
    cars,
    setCars,
    bids,
    setBids,
    users,
    setUsers,
    mobileMenuOpen,
    setMobileMenuOpen,
    loading,
    setLoading,
    isAdmin,
    setIsAdmin,

    showFilters,
    setShowFilters,

    filters,
    setFilters,
    defaultFilters,
    sortBy,
    setSortBy,

    favorites,
    setFavorites,
    savedSearches,
    setSavedSearches,

    // actions
    handleLogin,
    handleRegister,
    handleLogout,

    placeBid,
    addListing,
    updateListing,
    deleteListing,

    filterCars,
    resetFilters,
    clearFilterField,

    toggleFavorite,
    isFavorited,

    saveSearch,
    deleteSavedSearch,
    loadSavedSearch,

    applySort,

    // inspection
    addInspectionImage,
    removeInspectionImage,
    getInspectionForCar,
    selectCarForDetails, // prefer this helper when opening details from lists

    // admin exports
    exportListingsCSV,
    exportBidsCSV,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
