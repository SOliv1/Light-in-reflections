import { useState, useEffect } from "react";
import Constellation from "./components/Constellation";
import Calendar from "./components/Calendar";
import "./App.css";
import logo from "./assets/logo.png";
// eslint-disable-next-line no-unused-vars

import { Portal } from "./components/Portal/Portal";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getWeatherCondition } from "./utils/getWeatherCondition";
import useWeatherPhotos from "./hooks/useWeatherPhotos";

import BackgroundCarousel from "./components/BackgroundCarousel";

import Day01 from "./pages/Day01";
import Day02 from "./pages/Day02";
import Day03 from "./pages/Day03";
import Day04 from "./pages/Day04";
import Day05 from "./pages/Day05";
import Day06 from "./pages/Day06";
import Day07 from "./pages/Day07";
import Day08 from "./pages/Day08";
import Day09 from "./pages/Day09";
import Day10 from "./pages/Day10";
import Day11 from "./pages/Day11"
import Day12 from "./pages/Day12";
import Day13 from "./pages/Day13";
import Day14 from "./pages/Day14";
import Day15 from "./pages/Day15";
import Day16 from "./pages/Day16";
import Day17 from "./pages/Day17";
import Day18 from "./pages/Day18";
import Day19 from "./pages/Day19";
import Day20 from "./pages/Day20";
import Day21 from "./pages/Day21";
import Day22 from "./pages/Day22";
import Day23 from "./pages/Day23";
import Day24 from "./pages/Day24";
import Day25 from "./pages/day25";
import Day26 from "./pages/Day26";
import Day27 from "./pages/Day27";
import Day28 from "./pages/Day28";
import Day29 from "./pages/Day29";
import Day30 from "./pages/Day30";
import Day31 from "./pages/Day31";

function App() {

  const [mode, setMode] = useState("architectural");

  useEffect(() => {
  async function loadDayPhotos() {
    try {
      const res = await fetch("http://localhost:5000/days");
      const days = await res.json();

      const allPhotos = days.flatMap(day => day.photos || []);

      if (allPhotos.length > 0) {
        setPhotos(allPhotos);
      }
    } catch (err) {
      console.error("Error loading day photos:", err);
    }
  }

  loadDayPhotos();
}, []);


  // 1. Weather state MUST come before using it
  const [weather, setWeather] = useState(null);

  const manualCategories = {
  architectural: [
    "/images/arch1.jpg",
    "/images/arch2.jpg",
    "/images/arch3.jpg"
  ],
  water: [
    "/images/water1.jpg",
    "/images/water2.jpg",
    "/images/water3.jpg"
  ],
  macro: [
    "/images/macro1.jpg",
    "/images/macro2.jpg",
    "/images/macro3.jpg"
  ]
};

  // 2. Default fallback photos
  const defaultPhotos = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
  "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
];

  // 3. Weather-based photos (safe)
  const weatherData = useWeatherPhotos(weather);

  // 4. Choose which photos to use

    const [photos, setPhotos] = useState(defaultPhotos);

    useEffect(() => {
      async function decidePhotos() {
        if (!weather) return;

        // 1. Weather → MoodPhotos
        if (weatherData && !weatherData.fallback && weatherData.photos?.length > 0) {
          setPhotos(weatherData.photos);
          return;
        }

        // 2. Fallback → Gallery
        try {
          const res = await fetch("http://localhost:5000/days");
          const days = await res.json();

          const galleryPhotos = days.flatMap(day => day.photos || []);

          if (galleryPhotos.length > 0) {
            setPhotos(galleryPhotos);
            return;
          }
        } catch (err) {
          console.error("Days fetch error:", err);
        }

        // 3. Final fallback → mode-based manual categories
        setPhotos(manualCategories[mode] || defaultPhotos);
      }

      decidePhotos();
    }, [weather, weatherData, mode]);

    // 5. Mood (safe)
    const mood = weatherData?.mood || null;

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty(
            "--scroll",
            window.scrollY
          );
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const hour = new Date().getHours();

    let timeOfDay = "day";
    if (hour >= 19 || hour < 5) {
      timeOfDay = "night";
    } else if (hour >= 17) {
      timeOfDay = "evening";
    }

    useEffect(() => {
      async function loadWeather() {
        const condition = await getWeatherCondition(52.09, -1.95); // Evesham coords
        setWeather(condition);
      }
      loadWeather();
    }, []);


  const [veilMode, setVeilMode] = useState("veil-default");
  const [veilOn, setVeilOn] = useState(true);



  return (
  <Router>
    <>
      {/* 🌌 SKY SECTION */}
      <div className="sky-wrapper">
        <Constellation veilOn={veilOn} />
          <Portal
            type="mood"
            dayIndex={1}
            season="winter"
            mood={null}
            cueText=""
          />
      </div>


      {/* 🌙 MAIN APP SECTION */}
      <div className={`App mode-${mode}`}>
        <BackgroundCarousel photos={photos} veilMode={veilMode} />
          <img src={logo} className="App-logo" alt="My Reflections Glow logo" />

        {/* 🌅 Background Carousel — perfect placement */}
        <div className="content">
          <h1>Today feels {mood}</h1>
        </div>
          <h1 className="calendar-title">A Month of Light</h1>

        {/* MODE BUTTONS */}
        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => setMode("architectural")}>Architectural</button>
          <button onClick={() => setMode("water")}>Water</button>
          <button onClick={() => setMode("macro")}>Macro</button>
        </div>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Calendar />} />
          <Route path="/day01" element={<Day01 />} />
          <Route path="/day02" element={<Day02 />} />
          <Route path="/day03" element={<Day03 />} />
          <Route path="/day04" element={<Day04 />} />
          <Route path="/day05" element={<Day05 />} />
          <Route path="/day06" element={<Day06 />} />
          <Route path="/day07" element={<Day07 />} />
          <Route path="/day08" element={<Day08 />} />
          <Route path="/day09" element={<Day09 />} />
          <Route path="/day10" element={<Day10 />} />
          <Route path="/day11" element={<Day11 />} />
          <Route path="/day12" element={<Day12 />} />
          <Route path="/day13" element={<Day13 />} />
          <Route path="/day14" element={<Day14 />} />
          <Route path="/day15" element={<Day15 />} />
          <Route path="/day16" element={<Day16 />} />
          <Route path="/day17" element={<Day17 />} />
          <Route path="/day18" element={<Day18 />} />
          <Route path="/day19" element={<Day19 />} />
          <Route path="/day20" element={<Day20 />} />
          <Route path="/day21" element={<Day21 />} />
          <Route path="/day22" element={<Day22 />} />
          <Route path="/day23" element={<Day23 />} />
          <Route path="/day24" element={<Day24 />} />
          <Route path="/day25" element={<Day25 />} />
          <Route path="/day26" element={<Day26 />} />
          <Route path="/day27" element={<Day27 />} />
          <Route path="/day28" element={<Day28 />} />
          <Route path="/day29" element={<Day29 />} />
          <Route path="/day30" element={<Day30 />} />
          <Route path="/day31" element={<Day31 />} />
        </Routes>

        {/* GLOBAL MOOD ORB */}
        <div
          className="global-mood-orb"
          onClick={() => {
            if (mode === "architectural") setMode("water");
            else if (mode === "water") setMode("macro");
            else setMode("architectural");
          }}
        ></div>

        {/* VEIL TOGGLE */}

        <div className="veil-controls">
          <button onClick={() => setVeilMode("veil-default")}>Default Veil</button>
          <button onClick={() => setVeilMode("veil-lift")}>Lift Veil</button>
          <button onClick={() => setVeilMode("veil-none")}>No Veil</button>
        </div>
      </div>
    </>
  </Router>


);

}

export default App;