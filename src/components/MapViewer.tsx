import { useState, useRef, useEffect, useCallback } from 'react';
import './MapViewer.css';

interface MapViewerProps {
  mapImageUrl: string;
  children?: React.ReactNode;
}

export default function MapViewer({ mapImageUrl, children }: MapViewerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle mouse/touch start
  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  }, [position]);

  // Handle mouse/touch move
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  // Handle mouse/touch end
  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX, e.clientY);
    }
  };

  const onMouseUp = () => {
    handleEnd();
  };

  const onMouseLeave = () => {
    handleEnd();
  };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2) {
      // Pinch zoom
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Simple pinch zoom
      const newScale = Math.max(0.5, Math.min(3, scale * (distance / 200)));
      setScale(newScale);
    }
  };

  const onTouchEnd = () => {
    handleEnd();
  };

  // Wheel zoom - zoom towards mouse position
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current || !imageRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const delta = e.deltaY * -0.001;
    const newScale = Math.max(0.5, Math.min(3, scale + delta));
    const scaleChange = newScale / scale;
    
    // Zoom towards mouse position
    const newX = mouseX - (mouseX - position.x) * scaleChange;
    const newY = mouseY - (mouseY - position.y) * scaleChange;
    
    setScale(newScale);
    setPosition({ x: newX, y: newY });
  }, [scale, position]);

  // Center the image on initial load
  useEffect(() => {
    if (imageLoaded && containerRef.current && imageRef.current) {
      const container = containerRef.current;
      const image = imageRef.current;
      
      // Center the image initially
      const centerX = (container.clientWidth - image.naturalWidth) / 2;
      const centerY = (container.clientHeight - image.naturalHeight) / 2;
      
      setPosition({ x: centerX, y: centerY });
    }
  }, [imageLoaded]);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className="map-viewer"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
        className="map-container"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        <img
          ref={imageRef}
          src={mapImageUrl}
          alt="Map"
          className="map-image"
          draggable={false}
          onLoad={handleImageLoad}
          onError={() => {
            console.error('Failed to load map image:', mapImageUrl);
          }}
        />
      </div>
      {children}
    </div>
  );
}

