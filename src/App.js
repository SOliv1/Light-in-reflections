import { useState, useEffect } from "react";
import Constellation from "./components/Constellation";
import Calendar from "./components/Calendar";
import "./App.css";
import logo from "./assets/logo.png";
// eslint-disable-next-line no-unused-vars

import { Portal } from "./components/Portal/Portal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BackgroundCarousel from "./components/BackgroundCarousel";
import useWeatherPhotos from "./hooks/useWeatherPhotos";
import { fetchFromApi } from "./api";
import marbleBackground from "./assets/marble-grey-white.png";

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
import Day11 from "./pages/Day11";
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
  const fallbackPhotos = [marbleBackground];
  const [mode, setMode] = useState("architectural");
  const [photos, setPhotos] = useState([]);

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

  const backgroundImage = useWeatherPhotos();

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
    <Router>
      <>
        <div className="sky-wrapper">
          <Constellation veilOn={veilOn} />
          <Portal type="mood" dayIndex={1} season="winter" mood={null} cueText="" />
        </div>

        <div className={`App mode-${mode} time-${timeOfDay}`}>
          <BackgroundCarousel
            photos={photos}
            veilMode={veilMode}
            weatherImage={backgroundImage}
          />

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
    </Router>
  );
}

export default App;
