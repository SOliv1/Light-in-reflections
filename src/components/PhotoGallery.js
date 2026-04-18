import { useState } from "react";
import PhotoTile from "./PhotoTile";
import "./PhotoGallery.css";
import {
  moodImageFilter,
  moodImageOverlay,
  seasonalBorderGlow,
} from "../utils/seasonalMoodStyles";

const PhotoGallery = ({
  images,
  favourites,
  toggleFavourite,
  season,
  mood,
  lightingPresets = [],
  onSelectMood,
  onDelete,
  onApproachPortal,
}) => {
  const [expandedPhoto, setExpandedPhoto] = useState(null);

  // ⭐ GIF-safe Cloudinary URL helper
  const getSafeUrl = (url) => {
    if (!url) return url;
    if (url.toLowerCase().endsWith(".gif")) {
      return url; // preserve animation
    }
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  };

  return (
    <>
      <div className="photo-grid">
        {images.map((image) => (
          <PhotoTile
            key={image.id}
            img={{ ...image, url: getSafeUrl(image.url) }}   // ⭐ apply safe URL here
            photo={{ ...image, url: getSafeUrl(image.url) }} // ⭐ ensure PhotoTile receives safe URL
            isFavourite={!!favourites[image.id]}
            onToggle={() => toggleFavourite(image.id)}
            onClick={() => setExpandedPhoto(getSafeUrl(image.url))} // ⭐ modal uses safe URL
            season={season}
            onDelete={() => onDelete(image.id)}
            onApproachPortal={onApproachPortal}
          />
        ))}
      </div>

      {expandedPhoto && (
        <div className={`photo-modal ${mood || ""}`} onClick={() => setExpandedPhoto(null)}>
          {lightingPresets.length > 0 && (
            <div
              className="photo-modal-controls"
              onClick={(event) => event.stopPropagation()}
            >
              {lightingPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`photo-modal-light ${preset.id === mood ? "active" : ""}`}
                  onClick={() => onSelectMood?.(preset.id)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          <div
            className="photo-modal-frame"
            style={{
              "--season-glow": seasonalBorderGlow[season],
              "--mood-overlay": moodImageOverlay[mood] || "transparent",
            }}
          >
            <img
              src={expandedPhoto}   // ⭐ already safe
              alt="Expanded"
              className="seasonal-border"
              style={{
                filter: moodImageFilter[mood] || "none",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
