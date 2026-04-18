import { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.png";
import BackgroundCarousel from "./components/BackgroundCarousel";
import Calendar from "./components/Calendar";
import Constellation from "./components/Constellation";
import Portal from "./components/portal/Portal";
import WeatherGlyph from "./components/WeatherGlyphPanel";
import { fetchFromApi } from "./api";
import { BIRTHDAY_DAY, BIRTHDAY_MONTH } from "./data/birthdayExperience";
import useWeatherPhotos from "./hooks/useWeatherPhotos";
import DayPage from "./pages/DayPage";
import MockWeatherGlyph from "./dev-only/MockWeatherGlyph";
import DailyQuote from "./components/DailyQuote";
import "./styles/DrawerUnified.css";
import UnifiedDrawer from "./components/UnifiedDrawer";
import {
  moodImageFilter,
  moodImageOverlay,
  seasonalBorderGlow,
} from "./utils/seasonalMoodStyles";


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

function normalizeWeatherEntry(weatherEntry = {}) {
  const main = String(weatherEntry.main || "");
  const description = String(weatherEntry.description || "");
  const icon = String(weatherEntry.icon || "");
  const combined = `${main} ${description}`.toLowerCase();
  const isDaytimeIcon = icon.endsWith("d");

  if (
    isDaytimeIcon &&
    (
      combined.includes("few clouds") ||
      combined.includes("scattered clouds") ||
      combined.includes("broken clouds")
    )
  ) {
    return "sunny";
  }

  if (icon.startsWith("01") || icon.startsWith("02")) return "sunny";
  if (icon.startsWith("03") || icon.startsWith("04")) return "cloudy";
  if (icon.startsWith("09") || icon.startsWith("10")) return "rain";
  if (icon.startsWith("11")) return "storm";
  if (icon.startsWith("13")) return "snow";
  if (icon.startsWith("50")) return "mist";

  return normalizeWeatherClass(combined || main);
}

function formatLocationLabel(data) {
  const city = String(data?.name || "").trim();
  const country = String(data?.sys?.country || "").trim();

  if (city && country) {
    return `${city}, ${country}`;
  }

  if (city) {
    return city;
  }

  return "Local weather";
}

function AppShell() {
  const modes = ["architectural", "water", "macro"];
  const [mode, setMode] = useState("architectural");
  const [photos, setPhotos] = useState([]);
  const [veilMode, setVeilMode] = useState("off");
  const [autoVeil, setAutoVeil] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [weatherDescription, setWeatherDescription] = useState(null);
  const [weatherLocation, setWeatherLocation] = useState("Local weather");
  const veilOn = () => setVeilMode("on");
  const liftVeil = () => setVeilMode("lift");
  const veilOff = () => setVeilMode("off");


  const cycleMode = () => {
    const currentIndex = modes.indexOf(mode);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const birthdayMatch = location.pathname.match(/^\/day\/(\d{4})-(\d{2})-(\d{2})$/);
  const isBirthdayScene = birthdayMatch
    ? Number(birthdayMatch[2]) === BIRTHDAY_MONTH &&
      Number(birthdayMatch[3]) === BIRTHDAY_DAY
    : false;

  useEffect(() => {
    async function loadGallery() {
      async function attemptGalleryLoad(remainingAttempts = 3) {
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

        return urls;
      }

      try {
        let urls = [];
        let attemptsRemaining = 3;

        while (attemptsRemaining > 0) {
          try {
            urls = await attemptGalleryLoad(attemptsRemaining);
            break;
          } catch (error) {
            attemptsRemaining -= 1;
            if (attemptsRemaining === 0) {
              throw error;
            }

            await new Promise((resolve) => setTimeout(resolve, 1200));
          }
        }

        setPhotos(urls);
      } catch (err) {
        console.error("Failed to load gallery:", err);
        setPhotos([]);
      }
    }

    loadGallery();
  }, []);

  useEffect(() => {
    async function loadWeather() {
      async function applyWeatherResponse(res) {
        if (!res.ok) {
          throw new Error(`Weather request failed with status ${res.status}`);
        }

        const data = await res.json();
        const primaryWeather = data.weather?.[0] || {};

        setTemperature(data.main?.temp || null);
        setWeatherDescription(primaryWeather.description || primaryWeather.main || "Unknown");
        setWeatherCondition(normalizeWeatherEntry(primaryWeather));
        setWeatherLocation(formatLocationLabel(data));
      }

      const geolocationOptions = {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 300000,
      };

      try {
        if (!navigator.geolocation) {
          throw new Error("Geolocation not supported");
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const lat = pos.coords.latitude;
              const lon = pos.coords.longitude;
              const res = await fetchFromApi(`/api/weather?lat=${lat}&lon=${lon}`);
              await applyWeatherResponse(res);
            } catch (err) {
              console.error("Failed to load weather:", err);
              setWeatherDescription("Unknown");
              setWeatherCondition(normalizeWeatherClass("unknown"));
              setWeatherLocation("Local weather");
            }
          },
          (geoError) => {
            console.warn("Geolocation failed for weather:", geoError);
            loadWeatherFallback();
          },
          geolocationOptions
        );
      } catch (err) {
        console.error("Geolocation setup failed:", err);
        loadWeatherFallback();
      }

      async function loadWeatherFallback() {
        try {
          const res = await fetchFromApi("/api/weather");
          await applyWeatherResponse(res);
        } catch (err) {
          console.error("Failed to load weather:", err);
          setWeatherDescription("Unknown");
          setWeatherCondition(normalizeWeatherClass("unknown"));
          setWeatherLocation("Local weather");
        }
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

  const month = new Date().getMonth();
  const season =
    month === 11 || month <= 1
      ? "winter"
      : month >= 2 && month <= 4
        ? "spring"
        : month >= 5 && month <= 7
          ? "summer"
          : "autumn";

  const isNight = hour < 6 || hour >= 18;
  const backgroundImage = useWeatherPhotos(isHomePage);
  const weatherMood = weatherCondition || "neutral";

  const [orbColor, setOrbColor] = useState("#8ab4f8");

  const [isUnifiedDrawerOpen, setUnifiedDrawerOpen] = useState(false);
  const [drawerInitialTab, setDrawerInitialTab] = useState("reflections");
  const openUnifiedDrawer = (tab) => {
    setDrawerInitialTab(tab);
    setUnifiedDrawerOpen(true);
  };
  const closeUnifiedDrawer = () => setUnifiedDrawerOpen(false);
  const openReflections = () => openUnifiedDrawer("reflections");
  const openQuoteDrawer = () => openUnifiedDrawer("quote");

  useEffect(() => {
    if (mode === "architectural") setOrbColor("#e3b57a");
    if (mode === "water") setOrbColor("#7ac6ff");
    if (mode === "macro") setOrbColor("#d88cff");
  }, [mode]);

  const inspirationPanelStyle = {
    "--season-glow": seasonalBorderGlow[season],
    "--mood-overlay": moodImageOverlay[weatherMood] || "rgba(255, 255, 255, 0.08)",
    "--mood-filter": moodImageFilter[weatherMood] || "none",
    "--season-text": "white",
  };


  return (
  <>
    <div className="sky-wrapper">
      <Constellation veilMode={veilMode} birthdayMode={isBirthdayScene} />
      <Portal
        type="mood"
        dayIndex={1}
        season={season}
        mood={weatherMood}
        cueText=""
        weatherMood={weatherMood}
      />
    </div>

    <div className={`App mode-${mode} time-${timeOfDay}`}>
      <Link to="/" className="app-home-logo" aria-label="Return home">
        <img src={logo} className="App-logo" alt="My Reflections Glow logo" />
      </Link>

      {!isHomePage && (
        <Link
          to="/"
          className="crescent-portal app-home-orb"
          aria-label="Return home"
        />
      )}

      {isHomePage && (
        <BackgroundCarousel
          photos={photos}
          veilMode={veilMode}
          weatherImage={backgroundImage}
          weatherMood={weatherMood}
          season={season}
        />
      )}

      <div className="veil-controls-wrapper">
        <div className="veil-controls">
          <button onClick={veilOn}>Veil On</button>
          <button onClick={liftVeil}>Lift Veil</button>
          <button onClick={veilOff}>Veil Off</button>
          <button onClick={() => setAutoVeil(!autoVeil)}>
            {autoVeil ? "Manual Veil" : "Auto Veil"}
          </button>
        </div>

        {/* Top UI Row */}
        <div className="top-ui-row">
          <div className="reflections-trigger">
            <div
              className="inspiration-panel"
              style={inspirationPanelStyle}
            >
              <button className="inspiration-btn" onClick={openReflections}>
                Reflections
              </button>

              <button className="inspiration-btn" onClick={openQuoteDrawer}>
                Quote of the Day
              </button>
            </div>
          </div>

          <DailyQuote veilMode={veilMode} weatherMood={weatherMood} />
        </div>
      </div>

      {/* Seasonal Header */}
      <div className="seasonal-header">
        <h1 className="month-title">A Month of Light</h1>
        <h2 className="date-subtitle">April 2026</h2>
      </div>

      {/* Drawers */}
      <UnifiedDrawer
        isOpen={isUnifiedDrawerOpen}
        onClose={closeUnifiedDrawer}
        season={season}
        weatherMood={weatherMood}
        veilMode={veilMode}
        onVeilOn={veilOn}
        onVeilLift={liftVeil}
        onVeilOff={veilOff}
        orbColor={orbColor}
        initialTab={drawerInitialTab}
      />

      {/* Mode Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button
          className={mode === "architectural" ? "selected" : ""}
          onClick={() => setMode("architectural")}
        >
          Architectural
        </button>
        <button
          className={mode === "water" ? "selected" : ""}
          onClick={() => setMode("water")}
        >
          Water
        </button>
        <button
          className={mode === "macro" ? "selected" : ""}
          onClick={() => setMode("macro")}
        >
          Macro
        </button>
      </div>

      {/* Global Mood Orb */}
      <button
        type="button"
        className="global-mood-orb"
        aria-label={`Change visual mode. Current mode: ${mode}`}
        title={`Mode: ${mode}`}
        onClick={cycleMode}
      />

      {/* Weather Glyph */}
      {isHomePage && (
        <WeatherGlyph
          condition={weatherCondition}
          temperature={temperature}
          location={weatherLocation}
          timestamp={new Date().toISOString()}
          weatherMood={weatherMood}
          isNight={isNight}
          weatherDescription={weatherDescription}
        />
      )}

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <Calendar
              season={season}
              isNight={isNight}
              weatherCondition={weatherCondition}
              weatherMood={weatherMood}
              isHomePage={isHomePage}
            />
          }
        />
        <Route path="/dev/weather-glyph" element={<MockWeatherGlyph />} />
        <Route path="/day/:date" element={<DayPage />} />
      </Routes>
    </div>
  </>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

