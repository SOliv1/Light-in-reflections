import { useEffect, useState } from "react";
import "./BackgroundCarousel.css";
import Veil from "./Veil/Veil";

const VEIL_CLASS_MAP = {
  on: "veil-default",
  lift: "veil-lift",
  off: "veil-none",
};

const MOOD_CLASS_MAP = {
  sunny: "mood-sunny",
  clear: "mood-sunny",
  cloudy: "mood-cloudy",
  rain: "mood-rain",
  storm: "mood-storm",
  mist: "mood-mist",
  snow: "mood-snow",
  neutral: "mood-neutral",
  unknown: "mood-neutral",
};

export default function BackgroundCarousel({
  photos,
  veilMode,
  weatherImage,
  weatherMood,
  season,
}) {
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

  const veilClassName = VEIL_CLASS_MAP[veilMode] || VEIL_CLASS_MAP.on;
  const moodClassName = MOOD_CLASS_MAP[weatherMood] || MOOD_CLASS_MAP.neutral;
  const seasonClassName = season ? `season-${season}` : "";

  return (
    <div className={`background-carousel ${veilClassName} ${moodClassName} ${seasonClassName}`}>
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

      {/* Cinematic atmospheric veil */}
      <Veil moodColor={weatherMood} state={veilMode} season={season} />
    </div>
  );
}
