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

  // NEW: real photos from backend
  const [photos, setPhotos] = useState([]);

  // Fetch real data for this day
  useEffect(() => {
    fetch(`${API_BASE_URL}/days/16-03-26`)
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data.photos || []);
        setMood(data.mood || null);
      })
      .catch(() => {
        console.log("No data found for this day yet.");
      });
  }, []);

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    // Upload to backend → Cloudinary
    const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();

    // Save Cloudinary URL into MongoDB
    await fetch(`${API_BASE_URL}/days/add-photo`, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: "2026-03-16",
        photoUrl: uploadData.url,
      }),
    });

    window.location.reload();
  }

  const [selectedMood, setSelectedMood] = useState("");

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
        date: "2026-03-16",
        mood: selectedMood,
      }),
    });
  }

  return (
  <>
    <Link to="/" className="crescent-portal"></Link>

    <div className={`day-page ${mood || ""}`}>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Photo</button>

      <h2>Day 1 Reflection</h2>
      <p>Soft morning light on the water…</p>

      <div className="seasonal-portal">
        <div className="seasonal-portal-heading">
          <div className="seasonal-portal-line">The Light Awaits</div>
        </div>
      </div>

      <Portal
        type="seasonal"
        dayIndex={1}
        season="winter"
        mood={mood}
        cueText="Enter"
      />

      <PhotoGallery
        images={photos.map((url, index) => ({
          id: index,
          src: url,
          alt: `Reflection ${index}`,
        }))}
        favourites={favourites}
        toggleFavourite={toggleFavourite}
        season="winter"
      />

      {mood && <p className="mood-label">Mood: {mood}</p>}

      <div className="mood-selector">

        <button onClick={() => { setMood("calm"); setSelectedMood("calm"); }}>
          Calm
        </button>
        <button onClick={() => { setMood("joyful"); setSelectedMood("joyful"); }}>
          Joyful
        </button>
        <button onClick={() => { setMood("stormy"); setSelectedMood("stormy"); }}>
          Stormy
        </button>
        <button onClick={() => { setMood("reflective"); setSelectedMood("reflective"); }}>
          Reflective
        </button>
        <button onClick={() => { setMood("natural"); setSelectedMood("natural"); }}>
          Natural
        </button>
        <button onClick={saveMood} disabled={!selectedMood}>
          Save Mood
        </button>
      </div>
    </div>
  </>
  );
};

export default Day01;
