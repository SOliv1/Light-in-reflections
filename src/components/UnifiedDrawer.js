import { useEffect, useMemo, useState } from "react";
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
  { key: TAB_KEYS.reflections, label: "Short Reflections" },
  { key: TAB_KEYS.actions, label: "Quiet Actions" },
  { key: TAB_KEYS.notes, label: "Light Notes" },
  { key: TAB_KEYS.quote, label: "Quote of the Day" },
];

function normalizeInitialTab(value) {
  return TAB_CONFIG.some((tab) => tab.key === value) ? value : TAB_KEYS.reflections;
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
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const orbRGB = String(orbColor || "rgb(138, 180, 248)").replace("rgb(", "").replace(")", "");
  const quoteOfTheDay = useMemo(() => {
    const today = new Date();
    const index = (today.getDate() - 1) % quotes.length;
    return quotes[index];
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(normalizeInitialTab(initialTab));
    }
  }, [initialTab, isOpen]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("quietActions");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) setActions(parsed);
    } catch (error) {
      console.error("Failed to load quiet actions:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("quietActions", JSON.stringify(actions));
  }, [actions]);

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

  const addAction = () => {
    if (!actionText.trim()) return;
    const newItem = { id: Date.now(), text: actionText.trim() };
    setActions([newItem, ...actions]);
    setActionText("");
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    const newNote = { id: Date.now(), text: noteText.trim() };
    setNotes([newNote, ...notes]);
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
        <button className="drawer-close unified-drawer-close" onClick={onClose} aria-label="Close drawer">
          ✕
        </button>

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
          {activeTab === TAB_KEYS.reflections && (
            <section>
              <h3 className="panel-title">Short Reflections</h3>
              <ReflectionsPanel weatherMood={weatherMood} season={season} />
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
            </section>
          )}

          {activeTab === TAB_KEYS.actions && (
            <section>
              <h3 className="panel-title">Quiet Actions</h3>
              <div className="todo-input-row">
                <input
                  value={actionText}
                  onChange={(event) => setActionText(event.target.value)}
                  placeholder="Add a gentle intention…"
                />
                <button className="drawer-btn" onClick={addAction}>
                  Add Action
                </button>
              </div>
              <ul className="todo-list">
                {actions.map((item) => (
                  <li key={item.id}>
                    <span>{item.text}</span>
                    <button className="remove-btn" onClick={() => setActions(actions.filter((i) => i.id !== item.id))}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {activeTab === TAB_KEYS.notes && (
            <section>
              <h3 className="panel-title">Light Notes</h3>
              <textarea
                className="journal-area"
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                placeholder="Let your thoughts settle here…"
              />
              <button className="drawer-btn unified-add-note-btn" onClick={addNote}>
                Add Note
              </button>
              <ul className="notes-list">
                {notes.map((note) => (
                  <li key={note.id} className="note-item">
                    <p>{note.text}</p>
                    <button className="remove-btn" onClick={() => setNotes(notes.filter((n) => n.id !== note.id))}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {activeTab === TAB_KEYS.quote && (
            <section className="quote-drawer-content">
              <h3 className="panel-title">Quote of the Day</h3>
              <p className="drawer-quote">“{quoteOfTheDay.quote}”</p>
              <p className="drawer-author">~ {quoteOfTheDay.person} ~</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
