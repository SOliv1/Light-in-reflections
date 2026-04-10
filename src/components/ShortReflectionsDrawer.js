

export default function ShortReflectionsDrawer({ orbColor, onClose }) {
  return (
    <div className="short-reflections-drawer" style={{ '--orbColor': orbColor }}>
      <button className="drawer-close-btn" onClick={onClose}>
        Close
      </button>

      <h2 className="drawer-title">Short Reflections</h2>

      <div className="drawer-buttons">
        <button className="drawer-btn quiet-actions">Quiet Actions</button>
        <button className="drawer-btn light-notes">Light Notes</button>
      </div>
    </div>
  );
}
