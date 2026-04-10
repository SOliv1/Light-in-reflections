
export default function QuoteDrawer({ quote,orbColor, onClose,children }) {
  if (!quote) return null;

  return (
    <div className="quote-drawer-content">
      <div
        className="reflections-drawer"
        style={{
          '--orbColor': orbColor,
          '--orbColorRGB': orbColor.replace('rgb(', '').replace(')', '')
        }}
      >
        {children}
      </div>

      <h3 className="drawer-eyebrow">Quote of the Day</h3>
      <p className="drawer-quote">“{quote.quote}”</p>
      <p className="drawer-author">~ {quote.person} ~</p>
    </div>
  );
}
