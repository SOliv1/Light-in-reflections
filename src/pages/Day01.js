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

  async function handleDeletePhoto(photoIdToDelete) {
    const photoUrlToDelete = photoIdToDelete.split("-").slice(1).join("-");

    setPhotos((prev) =>
      prev.filter((url, index) => `${index}-${url}` !== photoIdToDelete)
    );

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

  const [portalState, setPortalState] = useState("resting");
  console.log("Portal state:", portalState);

  function handlePhotoApproach(photo) {
  setPortalState("aware");
}
  useEffect(() => {
    setMacroMood("spring-soft");
  }, []);


  return (
    <>
      <Link to="/" className="crescent-portal"></Link>

      <div className={`day-page ${mood || ""} ${macroMood || ""}`}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Photo</button>
        <div class="day-page spring-soft"></div>

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
          setMood={setMood}
          cueText="Begin"
          portalState={portalState}
        />


        <PhotoGallery
          images={photos.map((url, index) => ({
            id: `${index}-${url}`,
            src: url,
            alt: `Reflection ${index + 1}`,
          }))}
          favourites={favourites}
          toggleFavourite={toggleFavourite}
          season="winter"
          onDelete={handleDeletePhoto}
          onApproachPortal={handlePhotoApproach}
        />

        {mood && <p className="mood-label">Mood: {mood}</p>}

        <div className="mood-selector">
          <button
            onClick={() => {
              setMood("calm");
              setSelectedMood("calm");
            }}
          >
            Calm
          </button>

          <button
            onClick={() => {
              setMood("joyful");
              setSelectedMood("joyful");
            }}
          >
            Joyful
          </button>

          <button
            onClick={() => {
              setMood("stormy");
              setSelectedMood("stormy");
            }}
          >
            Stormy
          </button>

          <button
            onClick={() => {
              setMood("reflective");
              setSelectedMood("reflective");
            }}
          >
            Reflective
          </button>

          <button
            onClick={() => {
              setMood("natural");
              setSelectedMood("natural");
            }}
          >
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