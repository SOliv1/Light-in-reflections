import { useEffect, useState } from "react";
import "./BackgroundCarousel.css";

export default function BackgroundCarousel({ photos, veilMode }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!photos || photos.length === 0) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 20000);

    return () => clearInterval(interval);
  }, [photos]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className={`background-carousel ${veilMode}`}>
      {photos.map((src, i) => (
        <img
          key={i}
          src={src}
          className={`bg-image ${i === index ? "active" : ""}`}
          alt=""
        />
      ))}

      <div className="twilight-overlay" />
    </div>
  );
}

