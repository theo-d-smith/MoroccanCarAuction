/**
 * storage.js - helper utilities for persistent filters, saved searches, favorites, and url parsing.
 */

export const storageKeyFilters = "luxe_filters_v1";
export const storageKeySort = "luxe_sort_v1";
export const storageKeySavedSearchesPrefix = "luxe_saved_searches_";
export const storageKeyFavoritesPrefix = "luxe_favorites_";

/**
 * Read filters from URL query string or fallback to localStorage.
 * Returns {filters, sort}
 */
export function getFiltersFromUrlOrStorage(defaultFilters) {
  try {
    const params = new URLSearchParams(window.location.search);
    const newFilters = { ...defaultFilters };
    let hasAny = false;
    for (const key of Object.keys(defaultFilters)) {
      if (params.has(key)) {
        const val = params.get(key);
        if (typeof defaultFilters[key] === "boolean") {
          newFilters[key] = val === "true";
        } else {
          newFilters[key] = val ?? "";
        }
        hasAny = true;
      }
    }
    const sort =
      params.get("sort") || localStorage.getItem(storageKeySort) || null;
    if (hasAny) {
      return { filters: newFilters, sort };
    }
    const raw = localStorage.getItem(storageKeyFilters);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return { filters: { ...defaultFilters, ...parsed }, sort };
      } catch (e) {
        return { filters: defaultFilters, sort };
      }
    }
    return { filters: defaultFilters, sort };
  } catch (e) {
    return { filters: defaultFilters, sort: null };
  }
}

/**
 * Persist filters into localStorage and update the URL (history.replaceState)
 */
export function saveFiltersToStorageAndUrl(filters) {
  try {
    localStorage.setItem(storageKeyFilters, JSON.stringify(filters));
  } catch {}
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      const val = filters[key];
      if (typeof val === "boolean") {
        if (val) params.set(key, String(val));
      } else if (val !== "") {
        params.set(key, String(val));
      }
    });
    const newUrl =
      window.location.pathname +
      (params.toString() ? "?" + params.toString() : "");
    window.history.replaceState({}, "", newUrl);
  } catch {}
}

// per-owner saved searches
export function loadPerOwnerSavedSearches(owner) {
  try {
    const raw = localStorage.getItem(storageKeySavedSearchesPrefix + owner);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
export function savePerOwnerSavedSearches(owner, arr) {
  try {
    localStorage.setItem(
      storageKeySavedSearchesPrefix + owner,
      JSON.stringify(arr)
    );
  } catch {}
}

// per-owner favorites
export function loadPerOwnerFavorites(owner) {
  try {
    const raw = localStorage.getItem(storageKeyFavoritesPrefix + owner);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
export function savePerOwnerFavorites(owner, arr) {
  try {
    localStorage.setItem(
      storageKeyFavoritesPrefix + owner,
      JSON.stringify(arr)
    );
  } catch {}
}
