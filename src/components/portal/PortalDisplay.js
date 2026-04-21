
import { useState, useEffect } from "react";
import "./PortalDisplay.css";

export default function PortalDisplay({ mood, season }) {
  const [ukTime, setUkTime] = useState("");

  useEffect(() => {
    const update = () => {
      setUkTime(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Europe/London",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`portal-display portal-display--mood-${mood || "default"} portal-display--season-${season || "default"}`}
      aria-hidden="true"
    >
      <span className="portal-display__backdrop"></span>
      <span className="portal-display__time">{ukTime}</span>
    </div>
  );
}

