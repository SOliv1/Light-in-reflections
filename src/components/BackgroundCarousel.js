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

// Cloudinary randomizer
const randomImage = (folder) =>
  `https://res.cloudinary.com/dwpvbtoad/image/upload/fl_random/${folder}`;

export default function BackgroundCarousel({
  photos,
  veilMode,
  weatherImage,
  weatherMood,
  season,
}) {
  const [index, setIndex] = useState(0);

  // Multi-layer random atmospheric images
  const [deepLayer, setDeepLayer] = useState(null);
  const [midLayer, setMidLayer] = useState(null);
  const [foregroundLayer, setForegroundLayer] = useState(null);

  const hasPhotos = Array.isArray(photos) && photos.length > 0;

  // Rotate DB photos
  useEffect(() => {
    if (!hasPhotos) {
      setIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, 20000);

    return () => clearInterval(interval);
  }, [hasPhotos, photos]);

  // Always load Cloudinary atmospheric layers
  useEffect(() => {
    // Deep background (soft, blurred)
    setDeepLayer(randomImage("reflections"));

    // Mid-layer (seasonal or mood folder)
    const folder = season ? `${season}` : "Sandbox";
    setMidLayer(randomImage(folder));

    // Foreground shimmer (texture)
    setForegroundLayer(randomImage("textures"));
  }, [season, weatherMood]);

  const veilClassName = VEIL_CLASS_MAP[veilMode] || VEIL_CLASS_MAP.on;
  const moodClassName = MOOD_CLASS_MAP[weatherMood] || MOOD_CLASS_MAP.neutral;
  const seasonClassName = season ? `season-${season}` : "";

  return (
    <div className={`background-carousel ${veilClassName} ${moodClassName} ${seasonClassName}`}>

      {/* Deep atmospheric layer */}
      {deepLayer && (
        <div
          className="bg-layer deep-layer"
          style={{ backgroundImage: `url(${deepLayer})` }}
        />
      )}

      {/* Mid-layer (seasonal/mood) */}
      {midLayer && (
        <div
          className="bg-layer mid-layer"
          style={{ backgroundImage: `url(${midLayer})` }}
        />
      )}

      {/* Weather image layer */}
      {weatherImage && (
        <div
          className="weather-image"
          style={{ backgroundImage: `url(${weatherImage})` }}
        />
      )}

      {/* DB photos */}
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

      {/* Foreground shimmer */}
      {foregroundLayer && (
        <div
          className="bg-layer foreground-layer"
          style={{ backgroundImage: `url(${foregroundLayer})` }}
        />
      )}

      {/* Cinematic veil */}
      <Veil moodColor={weatherMood} state={veilMode} season={season} />
    </div>
  );
}
