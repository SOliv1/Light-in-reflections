import { useEffect, useState } from "react";
import "./BackgroundCarousel.css";

export default function BackgroundCarousel({ photos, veilMode, weatherImage }) {
  const [index, setIndex] = useState(0);
  const hasPhotos = Array.isArray(photos) && photos.length > 0;

  useEffect(() => {
    if (!hasPhotos) {
      setIndex(0);
      return undefined;
    }

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 20000);

    return () => clearInterval(interval);
  }, [hasPhotos, photos]);

  if (!hasPhotos && !weatherImage) {
    return null;
  }

  return (
    <div className={`background-carousel ${veilMode}`}>
      {weatherImage ? (
        <div
          className="weather-image"
          style={{ backgroundImage: `url(${weatherImage})` }}
        />
      ) : null}
      {hasPhotos &&
        photos.map((src, i) => (
          <img
            key={i}
            src={src}
            className={`bg-image ${i === index ? "active" : ""}`}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}

      <div className="twilight-overlay" />
    </div>
  );
}
