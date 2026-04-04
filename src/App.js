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
import { BIRTHDAY_DAY, BIRTHDAY_MONTH } from "./data/birthdayExperience";


import WeatherGlyph from './components/WeatherGlyph';

function normalizeWeatherClass(condition = "unknown") {
  const value = String(condition).toLowerCase();

  if (value.includes("clear")) return "sunny";
  if (value.includes("cloud")) return "cloudy";
  if (value.includes("drizzle") || value.includes("rain")) return "rain";
  if (value.includes("snow")) return "snow";
  if (
    value.includes("mist") ||
    value.includes("fog") ||
    value.includes("haze") ||
    value.includes("smoke") ||
    value.includes("dust") ||
    value.includes("ash")
  ) {
    return "mist";
  }
  if (value.includes("thunder") || value.includes("storm")) return "storm";

  return "unknown";
}

function AppShell() {
  const fallbackPhotos = [marbleBackground];
  const [mode, setMode] = useState("architectural");
  const [photos, setPhotos] = useState([]);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const birthdayMatch = location.pathname.match(/^\/day\/(\d{4})-(\d{2})-(\d{2})$/);
  const isBirthdayScene = birthdayMatch
    ? Number(birthdayMatch[2]) === BIRTHDAY_MONTH &&
      Number(birthdayMatch[3]) === BIRTHDAY_DAY
    : false;

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

  useEffect(() => {
  async function loadWeather() {
    try {
      const res = await fetchFromApi("/api/weather");

      if (!res.ok) {
        throw new Error(`Weather request failed with status ${res.status}`);
      }

      const data = await res.json();
      const rawWeather = String(data.weather?.[0]?.main || "Unknown");
      const normalizedWeather = normalizeWeatherClass(rawWeather);

      setWeatherData(data);
      setWeatherDescription(data.weather?.[0]?.description || rawWeather);
      setWeatherCondition(normalizedWeather);

    } catch (err) {
      console.error("Failed to load weather:", err);
      setWeatherDescription("Unknown");
      setWeatherCondition(normalizeWeatherClass("unknown"));
      setWeatherData(null);
    }
  }

  loadWeather();
}, []);


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
  // Real weather state
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [weatherDescription, setWeatherDescription] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  // Mood state based on weather
  const mockTemp = Math.floor(Math.random() * 20) + 5; // 5–25°C

  const month = new Date().getMonth();

  const season =
        month === 11 || month <= 1 ? "winter" :
        month >= 2 && month <= 4 ? "spring" :
        month >= 5 && month <= 7 ? "summer" :
       "autumn";


  const isNight = hour < 6 || hour >= 18;

  const backgroundImage = useWeatherPhotos(isHomePage);
  const weatherMood = weatherCondition || "neutral";






  return (
    <>
      <div className="sky-wrapper">
        <Constellation veilOn={veilOn} birthdayMode={isBirthdayScene} />
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

          <WeatherGlyph
            condition={weatherCondition}
            mood={weatherMood}
            isNight={isNight}
          />

          <div className="weather-description" style={{ marginTop: "1rem", color: "#fff" }}>
            {weatherData ? (
              <>
                <div>Weather: {weatherDescription}</div>
                <div>
                  Temperature: {weatherData.main?.temp?.toFixed(1)}°C
                </div>
                <div>
                  Location: {weatherData.name || "Unknown"}
                </div>
                <div>
                  As of: {new Date((weatherData.dt + (weatherData.timezone || 0)) * 1000).toLocaleString()}
                </div>
              </>
            ) : (
              "Loading weather..."
            )}
          </div>

          <Routes>
            <Route
              path="/"
              element={
                <Calendar
                  season={season}
                  isNight={isNight}
                  weatherCondition={weatherCondition}
                  weatherMood={weatherMood}
                />
              }
            />

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