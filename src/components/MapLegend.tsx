import './MapLegend.css';

interface LegendItem {
  id: string;
  label: string;
  time: string;
  color: string;
}

interface MapLegendProps {
  items: LegendItem[];
}

export default function MapLegend({ items }: MapLegendProps) {
  if (items.length === 0) return null;

  return (
    <div className="map-legend">
      {items.map((item) => (
        <div className="map-legend-item" key={item.id}>
          <span className="map-legend-dot" style={{ backgroundColor: item.color }} />
          <span className="map-legend-label">{item.label}</span>
          <span className="map-legend-time">{item.time}</span>
        </div>
      ))}
      <a
        href="https://earth.google.com/earth/d/129Ax4U6UHsjyfVA1fXURoh5uqko0Z7NZ?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="map-legend-link"
      >
        Open map ↗
      </a>
    </div>
  );
}
