import { useState, useEffect } from "react";
import Constellation from "./components/Constellation";
import Calendar from "./components/Calendar";
import "./App.css";
import logo from "./assets/logo.png";
// eslint-disable-next-line no-unused-vars

import { Portal } from "./components/Portal/Portal";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import BackgroundCarousel from "./components/BackgroundCarousel";
import useWeatherPhotos from "./hooks/useWeatherPhotos";
import { fetchFromApi } from "./api";
import marbleBackground from "./assets/marble-grey-white.png";
import DayPage from "./pages/DayPage";

function AppShell() {
  const fallbackPhotos = [marbleBackground];
  const [mode, setMode] = useState("architectural");
  const [photos, setPhotos] = useState([]);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetchFromApi("/api/gallery");

        if (!res.ok) {
          throw new Error(`Gallery request failed with status ${res.status}`);
        }

        const data = await res.json();
        const urls = Array.isArray(data)
          ? data
              .map((item) => item?.photoUrl || item?.imageUrl || item?.url)
              .filter(Boolean)
          : [];

        setPhotos(urls.length > 0 ? urls : fallbackPhotos);
      } catch (err) {
        console.error("Failed to load gallery:", err);
        setPhotos(fallbackPhotos);
      }
    }

    loadGallery();
  }, []);

  const backgroundImage = useWeatherPhotos(isHomePage);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty("--scroll", window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hour = new Date().getHours();
  let timeOfDay = "day";
  if (hour >= 19 || hour < 5) timeOfDay = "night";
  else if (hour >= 17) timeOfDay = "evening";

  const [veilMode, setVeilMode] = useState("veil-default");
  const [veilOn, setVeilOn] = useState(true);

  return (
    <>
      <div className="sky-wrapper">
        <Constellation veilOn={veilOn} />
        <Portal type="mood" dayIndex={1} season="winter" mood={null} cueText="" />
      </div>

      <div className={`App mode-${mode} time-${timeOfDay}`}>
        {isHomePage ? (
          <BackgroundCarousel
            photos={photos}
            veilMode={veilMode}
            weatherImage={backgroundImage}
          />
        ) : null}

          <img src={logo} className="App-logo" alt="My Reflections Glow logo" />

          <div className="content">
            {/* <h1>Today feels {mood}</h1> */}
          </div>
          <h1 className="calendar-title">A Month of Light</h1>

          <div style={{ marginBottom: "20px" }}>
            <button onClick={() => setMode("architectural")}>Architectural</button>
            <button onClick={() => setMode("water")}>Water</button>
            <button onClick={() => setMode("macro")}>Macro</button>
          </div>

          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/day/:date" element={<DayPage />} />
          </Routes>

          <div
            className="global-mood-orb"
            onClick={() => {
              if (mode === "architectural") setMode("water");
              else if (mode === "water") setMode("macro");
              else setMode("architectural");
            }}
          ></div>

          <div className="veil-controls">
            <button onClick={() => setVeilMode("veil-default")}>Default Veil</button>
            <button onClick={() => setVeilMode("veil-lift")}>Lift Veil</button>
            <button onClick={() => setVeilMode("veil-none")}>No Veil</button>
          </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
export default App;
