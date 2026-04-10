import { useState, useEffect } from "react";

export default function QuietActionsDrawer({ orbColor, onClose }) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  const orbRGB = orbColor.replace("rgb(", "").replace(")", "");

  // Load saved items
  useEffect(() => {
    const saved = localStorage.setItem("quietActions", JSON.stringify(items));

    if (saved) setItems(JSON.parse(saved));
  }, []);

  // Save items whenever they change
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  // ⭐ NEW: Add newest item at the TOP
  const addItem = () => {
    if (!text.trim()) return;
    const newItem = { id: Date.now(), text };
    setItems([newItem, ...items]);   // NEWEST FIRST
    setText("");
  };

  const deleteItem
   = (id) => {
    setItems(items.filter((n) => n.id !== id));
  };


  return (
    <div
      className="short-reflections-drawer"
      style={{
        "--orbColor": orbColor,
        "--orbColorRGB": orbRGB
      }}
    >
      <button className="drawer-close-btn" onClick={onClose}>×</button>
      <button className="drawer-close-text" onClick={onClose}>Close</button>

      <h3 className="panel-title">Quiet Actions</h3>

      <div className="todo-input-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a gentle intention…"
        />
        <button className="drawer-btn" onClick={addItem}>
          Add Action
        </button>

      </div>

      <ul className="todo-list">
        {items.map(item => (
          <li key={item.id}>
            <span>{item.text}</span>
            <button className="remove-btn" onClick={() =>
              setItems(items.filter(i => i.id !== item.id))
            }>
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
