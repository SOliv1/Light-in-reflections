import React from "react";
import "./Constellation.css";

const isEvening = () => {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 5;
};

function getSeason() {
  const month = new Date().getMonth();
  if (month === 11 || month === 0 || month === 1) return "winter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
}

export default function Constellation({ veilOn, birthdayMode = false }) {
  const season = getSeason();

  const moonPhase = {
    winter: "full",
    spring: "new",
    summer: "crescent",
    autumn: "waning",
  }[season];

  return (
    <div
      className={`constellation-wrapper interactive active ${
        birthdayMode ? "birthday-mode" : ""
      }`}
    >
      <div className={`moon ${moonPhase}`}></div>

      {/* Veil now controlled ONLY by App.js */}
      <div className={`constellation-overlay ${veilOn ? "active" : ""}`}></div>

      <div className="constellation-container">
        <div className="star" style={{ top: "4%", left: "12%" }}></div>
        <div className="star" style={{ top: "6%", left: "28%" }}></div>
        <div className="star" style={{ top: "5%", left: "45%" }}></div>
        <div className="star" style={{ top: "7%", left: "62%" }}></div>
        <div className="star" style={{ top: "9%", left: "78%" }}></div>
        <div className="star" style={{ top: "12%", left: "35%" }}></div>
        <div className="star" style={{ top: "14%", left: "70%" }}></div>

        <div className="shooting-star"></div>

        <div className="constellation-layer">
            <span className="star star-1"></span>
            <span className="star star-2"></span>
            <span className="star star-3"></span>

            <span className="star star-4"></span>
            <span className="star star-5"></span>
        </div>

        {birthdayMode ? (
          <>
            <div className="cancer-constellation">
              <span className="cancer-star cancer-star-1"></span>
              <span className="cancer-star cancer-star-2"></span>
              <span className="cancer-star cancer-star-3"></span>
              <span className="cancer-star cancer-star-4"></span>
              <span className="cancer-star cancer-star-5"></span>
              <span className="cancer-star cancer-star-6"></span>
              <span className="cancer-line cancer-line-1"></span>
              <span className="cancer-line cancer-line-2"></span>
              <span className="cancer-line cancer-line-3"></span>
              <span className="cancer-line cancer-line-4"></span>
              <span className="cancer-line cancer-line-5"></span>
            </div>
            <div className="planet-saturn">
              <span className="planet-ring"></span>
            </div>
            <div className="planet-orbital"></div>
            <div className="tiny-rocket">
              <span className="rocket-window"></span>
              <span className="rocket-flame"></span>
            </div>
          </>
        ) : null}

      </div>
    </div>
  );
}
