import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

/**
 * CountdownTimer - reusable small component for showing remaining time
 */
export default function CountdownTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center gap-2 text-amber-400">
      <Clock className="w-4 h-4" />
      <span className="font-mono font-semibold">{timeLeft}</span>
    </div>
  );
}
