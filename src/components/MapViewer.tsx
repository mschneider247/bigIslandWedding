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
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionRef = useRef(position);
  const scaleRef = useRef(scale);
  const isDraggingRef = useRef(isDragging);
  const pinchStartRef = useRef<{ distance: number; scale: number; center: { x: number; y: number } } | null>(null);

  // Keep refs in sync
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Handle mouse/touch start
  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX - positionRef.current.x,
      y: clientY - positionRef.current.y,
    };
  }, []);

  // Handle mouse/touch move
  const handleMove = useCallback((clientX: number, clientY: number) => {
    const newPosition = {
      x: clientX - dragStartRef.current.x,
      y: clientY - dragStartRef.current.y,
    };
    setPosition(newPosition);
  }, []);

  // Handle mouse/touch end
  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events with global listeners for better performance
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        handleMove(e.clientX, e.clientY);
      };

      const handleMouseUp = () => {
        handleEnd();
      };

      // Use global listeners for smoother dragging (non-passive for preventDefault)
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMove, handleEnd]);

  // Touch events with native listeners (non-passive to allow preventDefault)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        e.preventDefault();
        setIsDragging(true);
        dragStartRef.current = {
          x: e.touches[0].clientX - positionRef.current.x,
          y: e.touches[0].clientY - positionRef.current.y,
        };
        pinchStartRef.current = null;
      } else if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        
        const rect = container.getBoundingClientRect();
        pinchStartRef.current = {
          distance,
          scale: scaleRef.current,
          center: {
            x: centerX - rect.left,
            y: centerY - rect.top,
          },
        };
        setIsDragging(false);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current && !pinchStartRef.current) {
        e.preventDefault();
        const newPosition = {
          x: e.touches[0].clientX - dragStartRef.current.x,
          y: e.touches[0].clientY - dragStartRef.current.y,
        };
        setPosition(newPosition);
      } else if (e.touches.length === 2 && pinchStartRef.current) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        
        const distanceRatio = currentDistance / pinchStartRef.current.distance;
        const scaleChange = (distanceRatio - 1) * 0.5 + 1;
        const newScale = Math.max(0.4, Math.min(2, pinchStartRef.current.scale * scaleChange));
        
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        
        const rect = container.getBoundingClientRect();
        const currentCenter = {
          x: centerX - rect.left,
          y: centerY - rect.top,
        };
        
        const scaleRatio = newScale / pinchStartRef.current.scale;
        const newX = currentCenter.x - (currentCenter.x - positionRef.current.x) * scaleRatio;
        const newY = currentCenter.y - (currentCenter.y - positionRef.current.y) * scaleRatio;
        
        setScale(newScale);
        setPosition({ x: newX, y: newY });
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      pinchStartRef.current = null;
    };

    // Use native listeners with passive: false to allow preventDefault
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const onMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
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
    // Limit zoom out to 2.5x (minimum scale = 1/2.5 = 0.4) and zoom in to 2x (maximum scale = 2)
    const newScale = Math.max(0.4, Math.min(2, scale + delta));
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
      onMouseLeave={onMouseLeave}
      onWheel={onWheel}
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



