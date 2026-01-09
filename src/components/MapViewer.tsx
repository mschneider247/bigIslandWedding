import { useState, useRef, useEffect } from 'react';
import './MapViewer.css';

interface MapViewerProps {
  mapImageUrl: string;
  children?: React.ReactNode;
  onImageLoad?: () => void;
}

export default function MapViewer({ mapImageUrl, children, onImageLoad }: MapViewerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.2);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);

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

  // Touch handlers
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        setIsDragging(true);
        dragStartRef.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y };
        pinchStartRef.current = null;
      } else if (e.touches.length === 2) {
        e.preventDefault();
        setIsDragging(false);
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        pinchStartRef.current = { distance, scale };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging && !pinchStartRef.current) {
        e.preventDefault();
        setPosition({ x: e.touches[0].clientX - dragStartRef.current.x, y: e.touches[0].clientY - dragStartRef.current.y });
      } else if (e.touches.length === 2 && pinchStartRef.current) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        const distanceRatio = currentDistance / pinchStartRef.current.distance;
        const scaleChange = (distanceRatio - 1) * 0.1 + 1;
        const newScale = Math.max(0.2, Math.min(2, pinchStartRef.current.scale * scaleChange));

        // Get pinch center
        const rect = container.getBoundingClientRect();
        const centerX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
        const centerY = (touch1.clientY + touch2.clientY) / 2 - rect.top;

        // Zoom towards pinch center
        const scaleRatio = newScale / scale;
        const newX = centerX - (centerX - position.x) * scaleRatio;
        const newY = centerY - (centerY - position.y) * scaleRatio;

        setScale(newScale);
        setPosition({ x: newX, y: newY });
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      pinchStartRef.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [position, scale, isDragging]);

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const delta = e.deltaY * -0.001;
    const newScale = Math.max(0.2, Math.min(2, scale + delta));
    if (newScale === scale) return; // No change, don't update
    
    const scaleRatio = newScale / scale;

    // Zoom towards cursor
    const newX = cursorX - (cursorX - position.x) * scaleRatio;
    const newY = cursorY - (cursorY - position.y) * scaleRatio;

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };

  // Reset when image URL changes (needed for day/night mode switching)
  useEffect(() => {
    setScale(0.2);
    setPosition({ x: 0, y: 0 });
  }, [mapImageUrl]);

  const handleImageLoad = () => {
    if (onImageLoad) onImageLoad();
  };

  return (
    <div
      ref={containerRef}
      className="map-viewer"
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
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
          onLoad={handleImageLoad}
          onError={() => console.error('Failed to load map image:', mapImageUrl)}
          key={mapImageUrl}
        />
      </div>
      {children}
    </div>
  );
}
