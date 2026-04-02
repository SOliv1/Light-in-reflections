import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Portal } from "./Portal/Portal";
import PhotoGallery from "./PhotoGallery";
import { fetchFromApi } from "../api";

const MOODS = ["calm", "joyful", "stormy", "reflective", "natural"];

export default function PersistentDayPage({
  dayIndex,
  dayDate,
  season = "winter",
  macroMood = "architectural-water",
  title,
}) {
  const [favourites, setFavourites] = useState({});
  const [mood, setMood] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [portalState, setPortalState] = useState("resting");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDay() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const res = await fetchFromApi(`/days/${dayDate}`);
        if (!res.ok) {
          throw new Error(`Could not load gallery (${res.status})`);
        }

        const data = await res.json();
        if (!isMounted) {
          return;
        }

        setPhotos(data.photos || []);
        setMood(data.mood || null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          "We couldn't load your saved photos right now because the server or database is unavailable."
        );
        console.error(`Day ${dayIndex} load failed:`, error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDay();

    return () => {
      isMounted = false;
    };
  }, [dayDate, dayIndex]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function clearSelectedFile() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  }

  async function handleUpload() {
    if (!selectedFile || isUploading) {
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("saveToGallery", "false");

    try {
      setIsUploading(true);
      setErrorMessage("");

      const uploadRes = await fetchFromApi("/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error(`Image upload failed (${uploadRes.status})`);
      }

      const uploadData = await uploadRes.json();

      const saveRes = await fetchFromApi("/days/add-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dayDate,
          photoUrl: uploadData.photoUrl,
        }),
      });

      if (!saveRes.ok) {
        throw new Error(
          "The image uploaded, but the app could not save it to the database."
        );
      }

      setPhotos((prev) => [...prev, uploadData.photoUrl]);
      clearSelectedFile();
    } catch (error) {
      setErrorMessage(error.message);
      console.error(`Day ${dayIndex} upload failed:`, error);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeletePhoto(photoUrlToDelete) {
    setPhotos((prev) => prev.filter((url) => url !== photoUrlToDelete));

    try {
      const res = await fetchFromApi("/days/delete-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dayDate,
          photoUrl: photoUrlToDelete,
        }),
      });

      await res.json();
    } catch (error) {
      console.error(`Day ${dayIndex} delete failed:`, error);
    }
  }

  async function saveMood() {
    if (!selectedMood) {
      return;
    }

    try {
      setErrorMessage("");
      setMood(selectedMood);

      const res = await fetchFromApi("/days/set-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dayDate,
          mood: selectedMood,
        }),
      });

      if (!res.ok) {
        throw new Error(`Mood save failed (${res.status})`);
      }
    } catch (error) {
      setErrorMessage("We couldn't save your mood right now.");
      console.error(`Day ${dayIndex} mood save failed:`, error);
    }
  }

  function handlePhotoApproach() {
    setPortalState("aware");
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
    setMood(randomMood);
  }

  const macroMoodLabel =
    macroMood === "architectural-water"
      ? "Architectural Water"
      : macroMood === "macro"
        ? "Macro"
        : "";

  return (
    <>
      <Link to="/" className="crescent-portal"></Link>

      <div className={`day-page ${mood || ""} ${macroMood || ""}`}>
        {errorMessage && (
          <p role="alert" className="upload-error">
            {errorMessage}
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button onClick={handleUpload} disabled={!selectedFile || isUploading}>
          {isUploading ? "Uploading..." : "Upload Photo"}
        </button>

        {previewUrl ? (
          <div className="upload-preview">
            <img src={previewUrl} alt="Selected upload preview" />
          </div>
        ) : null}

        <h2 className="day-title">{title || `Day ${dayIndex} Reflection`}</h2>

        {macroMoodLabel && (
          <div className="day-tags">
            <span>{macroMoodLabel}</span>
          </div>
        )}

        <div className="seasonal-portal-line">The Light Awaits</div>

        <div className={`portal-wrapper ${portalState}`}>
          <Portal
            type="seasonal"
            dayIndex={dayIndex}
            season={season}
            mood={mood}
            setMood={setMood}
            cueText=""
            portalState={portalState}
          />

          {mood && (
            <div className="portal-mood-tag">
              Mood: {mood}
              {macroMood && ` -> ${macroMoodLabel}`}
            </div>
          )}
        </div>

        {isLoading ? (
          <p>Loading saved photos...</p>
        ) : (
          <PhotoGallery
            images={photos
              .slice()
              .reverse()
              .map((url) => ({
                id: url,
                src: url,
                alt: "Reflection",
              }))}
            favourites={favourites}
            toggleFavourite={(id) =>
              setFavourites((prev) => ({
                ...prev,
                [id]: !prev[id],
              }))
            }
            season={season}
            onDelete={handleDeletePhoto}
            onApproachPortal={handlePhotoApproach}
          />
        )}

        {mood && <p className="mood-label">Mood: {mood}</p>}

        <div className="mood-selector">
          {MOODS.map((nextMood) => (
            <button
              key={nextMood}
              onClick={() => {
                setMood(nextMood);
                setSelectedMood(nextMood);
              }}
            >
              {nextMood.charAt(0).toUpperCase() + nextMood.slice(1)}
            </button>
          ))}

          <button onClick={saveMood} disabled={!selectedMood}>
            Save Mood
          </button>
        </div>
      </div>
    </>
  );
}
