import { useState, useRef, useEffect } from 'react';
import './MapViewer.css';

// Zoom limits - same for both wheel and pinch zoom
// Adjusted for 150dpi images (MAX_SCALE doubled, MIN_SCALE allows zooming out further)
const MIN_SCALE = 0.2;
const MAX_SCALE = 4;
const INITIAL_SCALE = 0.4;

export interface MapMarker {
  id: string;
  label: string;
  time: string;
  x: number; // percent of image width
  y: number; // percent of image height
  color: string;
}

interface MapViewerProps {
  mapImageUrl: string;
  children?: React.ReactNode;
  markers?: MapMarker[];
  editable?: boolean;
  onMarkerMove?: (id: string, x: number, y: number) => void;
}

const clampPercent = (n: number) => Math.min(100, Math.max(0, n));

export default function MapViewer({ mapImageUrl, children, markers, editable, onMarkerMove }: MapViewerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(INITIAL_SCALE);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const draggingMarkerRef = useRef<string | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const pinchStartRef = useRef<{ distance: number; scale: number; centerX: number; centerY: number } | null>(null);
  
  // Use refs to track current state for touch handlers to avoid stale closures
  const positionRef = useRef(position);
  const scaleRef = useRef(scale);
  
  useEffect(() => {
    positionRef.current = position;
  }, [position]);
  
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  // Mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y });
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position]);

  // Touch handlers - using refs to avoid dependency issues
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Single touch - start dragging
        e.preventDefault();
        setIsDragging(true);
        const currentPos = positionRef.current;
        dragStartRef.current = { 
          x: e.touches[0].clientX - currentPos.x, 
          y: e.touches[0].clientY - currentPos.y 
        };
        pinchStartRef.current = null;
      } else if (e.touches.length === 2) {
        // Two touches - start pinch zoom
        e.preventDefault();
        setIsDragging(false);
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        
        // Calculate pinch center relative to container
        const rect = container.getBoundingClientRect();
        const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
        const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
        
        pinchStartRef.current = { 
          distance, 
          scale: scaleRef.current,
          centerX,
          centerY
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging && !pinchStartRef.current) {
        // Single touch drag
        e.preventDefault();
        setPosition({ 
          x: e.touches[0].clientX - dragStartRef.current.x, 
          y: e.touches[0].clientY - dragStartRef.current.y 
        });
      } else if (e.touches.length === 2 && pinchStartRef.current) {
        // Two touch pinch zoom
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        const distanceRatio = currentDistance / pinchStartRef.current.distance;
        
        // Calculate new scale based on distance change
        const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, pinchStartRef.current.scale * distanceRatio));
        
        // Get pinch center (can change during pinch)
        const rect = container.getBoundingClientRect();
        const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
        const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;
        
        // Zoom towards pinch center
        const currentPos = positionRef.current;
        const currentScale = scaleRef.current;
        const scaleRatio = newScale / currentScale;
        const newX = centerX - (centerX - currentPos.x) * scaleRatio;
        const newY = centerY - (centerY - currentPos.y) * scaleRatio;
        
        setScale(newScale);
        setPosition({ x: newX, y: newY });
        
        // Update pinch start with new values for smooth continuous zoom
        pinchStartRef.current = {
          distance: currentDistance,
          scale: newScale,
          centerX,
          centerY
        };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        // All touches ended
        setIsDragging(false);
        pinchStartRef.current = null;
      } else if (e.touches.length === 1) {
        // One touch remains - switch to drag mode
        setIsDragging(true);
        const currentPos = positionRef.current;
        dragStartRef.current = { 
          x: e.touches[0].clientX - currentPos.x, 
          y: e.touches[0].clientY - currentPos.y 
        };
        pinchStartRef.current = null;
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging]); // Only depend on isDragging, use refs for position/scale

  // Marker drag (dev tool for fine-tuning pin coordinates - only wired up when editable)
  useEffect(() => {
    if (!editable) return;

    const handlePointerMove = (e: PointerEvent) => {
      const id = draggingMarkerRef.current;
      if (!id || !mapContainerRef.current) return;
      const rect = mapContainerRef.current.getBoundingClientRect();
      const x = clampPercent(((e.clientX - rect.left) / rect.width) * 100);
      const y = clampPercent(((e.clientY - rect.top) / rect.height) * 100);
      onMarkerMove?.(id, x, y);
    };

    const handlePointerUp = () => {
      draggingMarkerRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [editable, onMarkerMove]);

  const handleMarkerPointerDown = (e: React.PointerEvent, id: string) => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    draggingMarkerRef.current = id;
  };

  const handleMarkerKeyDown = (e: React.KeyboardEvent, marker: MapMarker) => {
    if (!editable) return;
    const step = e.shiftKey ? 1 : 0.1;
    let { x, y } = marker;
    if (e.key === 'ArrowLeft') x -= step;
    else if (e.key === 'ArrowRight') x += step;
    else if (e.key === 'ArrowUp') y -= step;
    else if (e.key === 'ArrowDown') y += step;
    else return;
    e.preventDefault();
    onMarkerMove?.(marker.id, clampPercent(x), clampPercent(y));
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const delta = e.deltaY * -0.001;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));
    if (newScale === scale) return; // No change, don't update
    
    const scaleRatio = newScale / scale;

    // Zoom towards cursor
    const newX = cursorX - (cursorX - position.x) * scaleRatio;
    const newY = cursorY - (cursorY - position.y) * scaleRatio;

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };

  // Reset pan/zoom if the image URL ever changes
  useEffect(() => {
    setScale(INITIAL_SCALE);
    setPosition({ x: 0, y: 0 });
  }, [mapImageUrl]);

  return (
    <div
      ref={containerRef}
      className="map-viewer"
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
        ref={mapContainerRef}
        className={`map-container ${isDragging ? 'dragging' : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        <img
          src={mapImageUrl}
          alt="Map"
          className="map-image"
          draggable={false}
          onError={() => console.error('Failed to load map image:', mapImageUrl)}
          key={mapImageUrl}
        />
        {markers?.map((marker) => (
          <div
            key={marker.id}
            className={`map-marker ${editable ? 'map-marker-editable' : ''}`}
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              '--marker-color': marker.color,
            } as React.CSSProperties}
            title={`${marker.label} · ${marker.time}`}
            onPointerDown={(e) => handleMarkerPointerDown(e, marker.id)}
            onKeyDown={editable ? (e) => handleMarkerKeyDown(e, marker) : undefined}
            tabIndex={editable ? 0 : undefined}
            role={editable ? 'button' : undefined}
            aria-label={editable ? `${marker.label} pin - drag or use arrow keys to reposition` : undefined}
          >
            <span className="map-marker-pulse" />
            <span className="map-marker-dot" />
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
