import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useAppContext } from "../context/AppContext";

/**
 * InspectionPanel - defensive, logs its inputs so we can diagnose render problems.
 * Always renders a visible container. If data is missing it shows helpful notes.
 */

const CORNERS = [
  { key: "frontLeft", label: "Front Left", emoji: "📷" },
  { key: "frontRight", label: "Front Right", emoji: "📷" },
  { key: "rearLeft", label: "Rear Left", emoji: "📷" },
  { key: "rearRight", label: "Rear Right", emoji: "📷" },
];

export default function InspectionPanel({ car }) {
  const ctx = useAppContext();

  // Defensive logging to debug render issues
  useEffect(() => {
    console.log("[InspectionPanel] mounted", { car, ctxAvailable: !!ctx });
    return () => {
      console.log("[InspectionPanel] unmounted");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If car is missing, render a clear placeholder
  if (!car) {
    return (
      <div className="bg-red-900 bg-opacity-20 rounded-lg p-4 mt-6">
        <div className="text-red-300 font-semibold">
          Inspection data unavailable
        </div>
        <div className="text-sm text-red-400">
          No car was passed to the InspectionPanel.
        </div>
      </div>
    );
  }

  // Prefer the canonical inspection from context if available
  let inspection = car.inspection;
  try {
    if (ctx && typeof ctx.getInspectionForCar === "function") {
      const canonical = ctx.getInspectionForCar(car.id);
      if (canonical) inspection = canonical;
    }
  } catch (err) {
    console.error("[InspectionPanel] error calling getInspectionForCar:", err);
  }

  // Final defensiveness: ensure arrays exist
  inspection = {
    frontLeft: Array.isArray(inspection?.frontLeft) ? inspection.frontLeft : [],
    frontRight: Array.isArray(inspection?.frontRight)
      ? inspection.frontRight
      : [],
    rearLeft: Array.isArray(inspection?.rearLeft) ? inspection.rearLeft : [],
    rearRight: Array.isArray(inspection?.rearRight) ? inspection.rearRight : [],
  };

  // Log the normalized inspection so you can inspect it in the console
  useEffect(() => {
    console.log("[InspectionPanel] inspection data", {
      id: car.id,
      inspection,
    });
  }, [car.id, inspection]);

  const [openCorner, setOpenCorner] = useState(null);

  const openGallery = (cornerKey) => {
    setOpenCorner(cornerKey);
  };

  const closeGallery = () => setOpenCorner(null);

  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-6">
      <h3 className="text-xl font-bold text-white mb-4">
        Inspection — Corner Photos
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative bg-gray-700 rounded-lg p-6 flex items-center justify-center">
          {/* Fallback: if main image missing, show a gray box */}
          {car.images && car.images[0] ? (
            <img
              src={car.images[0]}
              alt="Car overview"
              className="w-full h-64 object-cover rounded-lg opacity-60"
            />
          ) : (
            <div className="w-full h-64 bg-gray-600 rounded-lg opacity-40" />
          )}

          {/* hotspot buttons */}
          <button
            onClick={() => openGallery("frontLeft")}
            className={`absolute left-4 top-4 p-3 rounded-full ${
              inspection.frontLeft.length
                ? "ring-4 ring-red-600"
                : "ring-4 ring-green-600"
            } bg-gray-900 bg-opacity-40`}
            aria-label="Front Left"
          >
            <div className="text-white text-sm">FL</div>
          </button>

          <button
            onClick={() => openGallery("frontRight")}
            className={`absolute right-4 top-4 p-3 rounded-full ${
              inspection.frontRight.length
                ? "ring-4 ring-red-600"
                : "ring-4 ring-green-600"
            } bg-gray-900 bg-opacity-40`}
            aria-label="Front Right"
          >
            <div className="text-white text-sm">FR</div>
          </button>

          <button
            onClick={() => openGallery("rearLeft")}
            className={`absolute left-4 bottom-4 p-3 rounded-full ${
              inspection.rearLeft.length
                ? "ring-4 ring-red-600"
                : "ring-4 ring-green-600"
            } bg-gray-900 bg-opacity-40`}
            aria-label="Rear Left"
          >
            <div className="text-white text-sm">RL</div>
          </button>

          <button
            onClick={() => openGallery("rearRight")}
            className={`absolute right-4 bottom-4 p-3 rounded-full ${
              inspection.rearRight.length
                ? "ring-4 ring-red-600"
                : "ring-4 ring-green-600"
            } bg-gray-900 bg-opacity-40`}
            aria-label="Rear Right"
          >
            <div className="text-white text-sm">RR</div>
          </button>
        </div>

        <div className="space-y-4">
          {CORNERS.map((c) => {
            const images = inspection[c.key] || [];
            const hasProblems = images.some(
              (i) => i.category === "engine" || i.category === "damage"
            );
            return (
              <div
                key={c.key}
                className="bg-gray-900 rounded-lg p-4 flex items-center justify-between"
              >
                <div
                  className="flex items-start gap-4 cursor-pointer"
                  onClick={() => openGallery(c.key)}
                >
                  <div className="text-2xl">{c.emoji}</div>
                  <div>
                    <div className="text-white font-semibold">
                      View {c.label}
                    </div>
                    <div className="text-sm text-gray-400">
                      {images.length} image(s)
                    </div>

                    {hasProblems ? (
                      <div className="mt-2 inline-flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-600 bg-opacity-20 flex items-center justify-center">
                          <span role="img" aria-label="engine">
                            🛠️
                          </span>
                        </div>
                        <div className="text-sm text-red-300 font-semibold">
                          {
                            images.filter(
                              (i) =>
                                i.category === "engine" ||
                                i.category === "damage"
                            ).length
                          }{" "}
                          highlight(s)
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 inline-flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-600 bg-opacity-20 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="text-sm text-green-300 font-semibold">
                          {images.length === 0
                            ? "No highlights"
                            : "No problems"}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => openGallery(c.key)}
                    className="px-3 py-2 bg-gray-700 rounded text-sm text-white"
                  >
                    Open
                  </button>
                </div>
              </div>
            );
          })}

          <div className="text-sm text-gray-400">
            Tip: sellers can add images for each corner in the listing
            management UI. If you are the seller and can't see upload controls,
            confirm you're logged in and that your account is a seller.
          </div>
        </div>
      </div>

      {/* Gallery modal (simple) */}
      {openCorner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-3xl w-full overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-semibold">
                Gallery — {CORNERS.find((x) => x.key === openCorner).label}
              </h4>
              <button
                onClick={closeGallery}
                className="text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {(inspection[openCorner] || []).length === 0 ? (
                <div className="text-gray-400 text-center p-6">
                  No photos yet
                </div>
              ) : (
                (inspection[openCorner] || []).map((img) => (
                  <div
                    key={img.id}
                    className="bg-gray-700 rounded-lg p-4 flex gap-4 items-start"
                  >
                    <img
                      src={img.url}
                      alt={img.description}
                      className="w-36 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-white font-semibold">
                          {img.category?.toUpperCase() || "OTHER"}
                        </div>
                        <div className="text-sm text-gray-400">{img.id}</div>
                      </div>
                      <p className="text-gray-300 mt-2">
                        {img.description || "No description"}
                      </p>
                      {/* Removal handled by seller flows elsewhere */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
