import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReflectionsPanel from "./ReflectionsPanel";
import { quotes } from "../data/quotes";
import "./Drawer.css";
import "../styles/DrawerUnified.css";

const TAB_KEYS = {
  reflections: "reflections",
  actions: "actions",
  notes: "notes",
  quote: "quote",
};

const TAB_CONFIG = [
  { key: TAB_KEYS.reflections, label: "Reflections" },
  { key: TAB_KEYS.actions, label: "Actions" },
  { key: TAB_KEYS.notes, label: "Notes" },
  { key: TAB_KEYS.quote, label: "Quote" },
];

function normalizeInitialTab(value) {
  return TAB_CONFIG.some((tab) => tab.key === value) ? value : TAB_KEYS.reflections;
}

function todayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function formatDisplayDate() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function UnifiedDrawer({
  isOpen,
  onClose,
  season,
  weatherMood,
  veilMode,
  onVeilOn,
  onVeilLift,
  onVeilOff,
  orbColor,
  initialTab = TAB_KEYS.reflections,
}) {
  const [activeTab, setActiveTab] = useState(normalizeInitialTab(initialTab));

  const [actions, setActions] = useState([]);
  const [actionText, setActionText] = useState("");

  const [dailyReflection, setDailyReflection] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);
  const reflectionTimer = useRef(null);

  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");

  const [freshThought, setFreshThought] = useState("");
  const [freshThoughtSaved, setFreshThoughtSaved] = useState(false);
  const freshThoughtTimer = useRef(null);

  const orbRGB = (() => {
    if (!orbColor) return "138, 180, 248";
    const hex = String(orbColor).match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (hex) return `${parseInt(hex[1], 16)}, ${parseInt(hex[2], 16)}, ${parseInt(hex[3], 16)}`;
    const rgb = String(orbColor).match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
    if (rgb) return `${rgb[1]}, ${rgb[2]}, ${rgb[3]}`;
    return "138, 180, 248";
  })();

  const quoteOfTheDay = useMemo(() => {
    const today = new Date();
    const index = (today.getDate() - 1) % quotes.length;
    return quotes[index];
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("quietActions");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setActions(
          parsed.map((item) => ({
            id: item.id,
            text: item.text,
            done: item.done || false,
            createdDate: item.createdDate || todayDateKey(),
          }))
        );
      }
    } catch (error) {
      console.error("Failed to load quiet actions:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("quietActions", JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    const saved = localStorage.getItem(`dailyReflection-${todayDateKey()}`);
    setDailyReflection(saved || "");
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lightNotes");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setNotes(parsed);
    } catch (error) {
      console.error("Failed to load light notes:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lightNotes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const saved = localStorage.getItem(`freshThought-${todayDateKey()}`);
    setFreshThought(saved || "");
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(normalizeInitialTab(initialTab));
    }
  }, [initialTab, isOpen]);

  const addAction = () => {
    if (!actionText.trim()) return;
    setActions([
      { id: Date.now(), text: actionText.trim(), done: false, createdDate: todayDateKey() },
      ...actions,
    ]);
    setActionText("");
  };

  const toggleAction = (id) => {
    setActions(actions.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const deleteAction = (id) => {
    setActions(actions.filter((item) => item.id !== id));
  };

  const handleReflectionChange = useCallback((text) => {
    setDailyReflection(text);
    setReflectionSaved(false);
    clearTimeout(reflectionTimer.current);
    reflectionTimer.current = setTimeout(() => {
      localStorage.setItem(`dailyReflection-${todayDateKey()}`, text);
      setReflectionSaved(true);
    }, 800);
  }, []);

  const handleFreshThoughtChange = useCallback((text) => {
    setFreshThought(text);
    setFreshThoughtSaved(false);
    clearTimeout(freshThoughtTimer.current);
    freshThoughtTimer.current = setTimeout(() => {
      localStorage.setItem(`freshThought-${todayDateKey()}`, text);
      setFreshThoughtSaved(true);
    }, 800);
  }, []);

  const addNote = () => {
    if (!noteText.trim()) return;
    setNotes([{ id: Date.now(), text: noteText.trim() }, ...notes]);
    setNoteText("");
  };

  const closeOnOverlay = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`drawer-overlay unified-drawer-overlay ${isOpen ? "open" : ""}`}
      aria-hidden={!isOpen}
      onClick={closeOnOverlay}
    >
      <div
        className="drawer-panel unified-drawer-panel"
        role="dialog"
        aria-modal="true"
        style={{
          "--orbColor": orbColor,
          "--orbColorRGB": orbRGB,
        }}
      >
        {/* Header: date + close X */}
        <div className="unified-drawer-header">
          <p className="unified-drawer-date">{formatDisplayDate()}</p>
          <button className="drawer-close unified-drawer-close" onClick={onClose} aria-label="Close drawer">
            ✕
          </button>
        </div>

        <div className="unified-drawer-tabs" role="tablist" aria-label="Reflection drawer tabs">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`unified-drawer-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="short-reflections-drawer">

          {/* ── REFLECTIONS TAB ── */}
          {activeTab === TAB_KEYS.reflections && (
            <section>
              <h3 className="panel-title">Today's Reflection</h3>
              <ReflectionsPanel weatherMood={weatherMood} season={season} />
              <textarea
                className="daily-reflection-area"
                value={dailyReflection}
                onChange={(e) => handleReflectionChange(e.target.value)}
                placeholder="A quiet thought for today…"
                rows={4}
              />
              {reflectionSaved && <p className="saved-indicator">✦ saved</p>}
              <div className="unified-veil-controls">
                <button className={`drawer-btn ${veilMode === "on" ? "selected" : ""}`} onClick={onVeilOn}>
                  Veil On
                </button>
                <button className={`drawer-btn ${veilMode === "lift" ? "selected" : ""}`} onClick={onVeilLift}>
                  Lift Veil
                </button>
                <button className={`drawer-btn ${veilMode === "off" ? "selected" : ""}`} onClick={onVeilOff}>
                  Veil Off
                </button>
              </div>
              <button className="drawer-close-full" onClick={onClose}>Close</button>
            </section>
          )}

          {/* ── ACTIONS TAB ── */}
          {activeTab === TAB_KEYS.actions && (
            <section>
              <h3 className="panel-title">Quiet Actions</h3>
              <p className="section-prompt">Carried forward until ticked off.</p>
              <div className="todo-input-row">
                <input
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAction()}
                  placeholder="A gentle intention…"
                />
                <button className="drawer-btn" onClick={addAction}>Add</button>
              </div>
              <ul className="todo-list">
                {actions.map((item) => (
                  <li key={item.id} className={item.done ? "done" : ""}>
                    <input
                      type="checkbox"
                      className="action-checkbox"
                      checked={item.done}
                      onChange={() => toggleAction(item.id)}
                      aria-label="Mark complete"
                    />
                    <span>{item.text}</span>
                    <button className="remove-btn" onClick={() => deleteAction(item.id)} aria-label="Remove">×</button>
                  </li>
                ))}
              </ul>
              <button className="drawer-close-full" onClick={onClose}>Close</button>
            </section>
          )}

          {/* ── LIGHT NOTES TAB ── */}
          {activeTab === TAB_KEYS.notes && (
            <section>
              <h3 className="panel-title">Light Notes</h3>

              <p className="section-label">Fresh Thought</p>
              <textarea
                className="fresh-thought-area"
                value={freshThought}
                onChange={(e) => handleFreshThoughtChange(e.target.value)}
                placeholder="One thought to hold today…"
                rows={2}
              />
              {freshThoughtSaved && <p className="saved-indicator">✦ saved</p>}

              <hr className="section-divider" />

              <p className="section-label">Quiet Journal</p>
              <textarea
                className="journal-area"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Thoughts that stay until you let them go…"
                rows={2}
              />
              <button className="drawer-btn unified-add-note-btn" onClick={addNote}>Save Note</button>
              <ul className="notes-list">
                {notes.map((note) => (
                  <li key={note.id} className="note-item">
                    <p>{note.text}</p>
                    <button
                      className="remove-btn"
                      onClick={() => setNotes(notes.filter((n) => n.id !== note.id))}
                      aria-label="Delete note"
                    >×</button>
                  </li>
                ))}
              </ul>
              <button className="drawer-close-full" onClick={onClose}>Close</button>
            </section>
          )}

          {/* ── QUOTE TAB ── */}
          {activeTab === TAB_KEYS.quote && (
            <section className="quote-drawer-content">
              <h3 className="panel-title">Quote of the Day</h3>
              <p className="drawer-quote">"{quoteOfTheDay.quote}"</p>
              <p className="drawer-author">~ {quoteOfTheDay.person} ~</p>
              <button className="drawer-close-full" onClick={onClose}>Close</button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

