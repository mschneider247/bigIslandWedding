import { useState } from 'react';
import './MarkerDevPanel.css';
import type { MapMarker } from './MapViewer';

interface MarkerDevPanelProps {
  markers: MapMarker[];
}

function buildSnippet(markers: MapMarker[]): string {
  const entries = markers
    .map(
      (m) =>
        `  {\n    id: '${m.id}',\n    label: '${m.label}',\n    time: '${m.time}',\n    x: ${m.x.toFixed(1)},\n    y: ${m.y.toFixed(1)},\n    color: '${m.color}',\n  },`
    )
    .join('\n');
  return `export const weddingLocations = [\n${entries}\n];`;
}

export default function MarkerDevPanel({ markers }: MarkerDevPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildSnippet(markers));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied - nothing to fall back to here.
    }
  };

  return (
    <div className="marker-dev-panel">
      <div className="marker-dev-panel-title">Pin editor - drag a pin, or focus it and use arrow keys (+ Shift for big steps)</div>
      {markers.map((m) => (
        <div key={m.id} className="marker-dev-panel-row">
          <span className="marker-dev-panel-dot" style={{ backgroundColor: m.color }} />
          <span className="marker-dev-panel-label">{m.label}</span>
          <span className="marker-dev-panel-coords">
            {m.x.toFixed(1)}%, {m.y.toFixed(1)}%
          </span>
        </div>
      ))}
      <button type="button" className="marker-dev-panel-copy" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy config snippet'}
      </button>
    </div>
  );
}
