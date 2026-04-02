import React, { useEffect, useRef, useState } from "react";
import PhotoGallery from "../components/PhotoGallery";
import { Link } from "react-router-dom";
import { Portal } from "../components/Portal/Portal";
import { fetchFromApi } from "../api";

const Day01 = () => {
  const dayDate = "18-03-2026";
  const [favourites, setFavourites] = useState({});
  const [mood, setMood] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [macroMood, setMacroMood] = useState(null);
  const [selectedMood, setSelectedMood] = useState("");
  const [portalState, setPortalState] = useState("resting");
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
        console.error("Day load failed:", error);
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
  }, [dayDate]);

  useEffect(() => {
    setMacroMood("architectural-water"); // or "macro" depending on your logic
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
  }

  async function handleUpload() {
    if (!selectedFile || isUploading) return;

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
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeletePhoto(photoUrlToDelete) {

  // 1. Remove from UI immediately
  setPhotos((prev) =>
    prev.filter((url) => url !== photoUrlToDelete)
  );

  // 2. Remove from database
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
  } catch (err) {
    console.log("delete failed:", err);
  }
}

  const toggleFavourite = (id) => {
    setFavourites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  async function saveMood() {
    if (!selectedMood) return;

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
      console.error("Mood save failed:", error);
    }
  }

  function handlePhotoApproach(photo) {
  setPortalState("aware");

  // The Door begins the story — choose a random mood
  const moods = ["calm", "joyful", "stormy", "reflective", "natural"];
  const randomMood = moods[Math.floor(Math.random() * moods.length)];

  setMood(randomMood);
  }


  // Human-readable macro mood label
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

        {/* Upload controls */}
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

        {/* Title */}
        <h2 className="day-title">Day 1 Reflection</h2>

        {/* Macro mood tags */}
        {macroMoodLabel && (
          <div className="day-tags">
            <span>{macroMoodLabel}</span>
          </div>
        )}

        {/* Subtitle */}
        <div className="seasonal-portal-line">The Light Awaits</div>

        {/* Door */}
        <div className={`portal-wrapper ${portalState}`}>

          <Portal
            type="seasonal"
            dayIndex={1}
            season="winter"
            mood={mood}
            setMood={setMood}
            cueText=""
            portalState={portalState}
          />

          {/* Mood + override hint */}
          {mood && (
            <div className="portal-mood-tag">
              Mood: {mood}
              {macroMood && ` → ${macroMoodLabel}`}
            </div>
          )}

        </div>

        {/* Photos — newest first */}
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
            toggleFavourite={toggleFavourite}
            season="winter"
            onDelete={handleDeletePhoto}
            onApproachPortal={handlePhotoApproach}
          />
        )}


        {/* Mood label */}
        {mood && <p className="mood-label">Mood: {mood}</p>}

        {/* Mood selector */}
        <div className="mood-selector">
          {["calm", "joyful", "stormy", "reflective", "natural"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMood(m);
                setSelectedMood(m);
              }}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}

          <button onClick={saveMood} disabled={!selectedMood}>
            Save Mood
          </button>
        </div>
      </div>
    </>
  );
};

export default Day01;
