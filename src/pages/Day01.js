// src/pages/Day01.js
import React, { useState, useEffect } from "react";
import PhotoGallery from "../components/PhotoGallery";
import { Link } from "react-router-dom";
import { Portal } from "../components/Portal/Portal";
import { API_BASE_URL } from "../config";

const Day01 = () => {
  const [favourites, setFavourites] = useState({});
  const [mood, setMood] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [macroMood, setMacroMood] = useState(null);
  const [selectedMood, setSelectedMood] = useState("");
  const [portalState, setPortalState] = useState("resting");

  useEffect(() => {
    fetch(`${API_BASE_URL}/days/18-03-2026`)
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data.photos || []);
        setMood(data.mood || null);
      })
      .catch(() => {
        console.log("No data found for this day yet.");
      });
  }, []);

  useEffect(() => {
    setMacroMood("architectural-water"); // or "macro" depending on your logic
  }, []);

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();

    await fetch(`${API_BASE_URL}/days/add-photo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: "18-03-2026",
        photoUrl: uploadData.photoUrl,
      }),
    });

    setPhotos((prev) => [...prev, uploadData.photoUrl]);
    setSelectedFile(null);
  }

  async function handleDeletePhoto(photoUrlToDelete) {

  // 1. Remove from UI immediately
  setPhotos((prev) =>
    prev.filter((url) => url !== photoUrlToDelete)
  );

  // 2. Remove from database
  try {
    const res = await fetch(`${API_BASE_URL}/days/delete-photo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: "18-03-2026",
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

    setMood(selectedMood);

    await fetch(`${API_BASE_URL}/days/set-mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: "18-03-2026",
        mood: selectedMood,
      }),
    });
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

        {/* Upload controls */}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Photo</button>

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
            cueText="The Door begins the story"
            portalState={portalState}
          />

          {portalState === "aware" && (
        <div className="portal-subtitle">
          You can change the ending if you want.
        </div>
      )}

        </div>

        {/* Photos — newest first */}
        <PhotoGallery
          images={photos
            .slice()
            .reverse()
            .map((url) => ({
              id: url,        // stable ID
              src: url,
              alt: "Reflection",
            }))}
          favourites={favourites}
          toggleFavourite={toggleFavourite}
          season="winter"
          onDelete={handleDeletePhoto}
          onApproachPortal={handlePhotoApproach}
        />


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
