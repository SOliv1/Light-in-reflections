export default function QuoteDrawer({ quote }) {
  if (!quote) return null;

  return (
    <div className="quote-drawer-content">
      <h3 className="drawer-eyebrow">Quote of the Day</h3>
      <p className="drawer-quote">“{quote.quote}”</p>
      <p className="drawer-author">~ {quote.person} ~</p>
    </div>
  );
}
