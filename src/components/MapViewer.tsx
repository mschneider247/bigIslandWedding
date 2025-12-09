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
  const pinchStartRef = useRef<{ distance: number; scale: number; center: { x: number; y: number } } | null>(null);

  // Keep position ref in sync
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Clamp position to keep within bounds (max 200px border)
  const clampPosition = useCallback((x: number, y: number, currentScale: number) => {
    if (!containerRef.current || !imageRef.current) {
      return { x, y };
    }

    const container = containerRef.current;
    const image = imageRef.current;
    const maxBorder = 200;

    // Calculate scaled image dimensions (accounting for JavaScript scale only)
    // CSS scale from media queries affects visual size but layout calculations use natural dimensions
    const scaledWidth = image.naturalWidth * currentScale;
    const scaledHeight = image.naturalHeight * currentScale;

    // Calculate bounds - allow up to 200px of border on any side
    // Left edge: can't scroll more than 200px to the left
    const minX = -maxBorder;
    // Right edge: image right edge (x + scaledWidth) should not exceed container width + 200px
    const maxX = container.clientWidth - scaledWidth + maxBorder;

    // Top edge: can't scroll more than 200px up
    const minY = -maxBorder;
    // Bottom edge: image bottom edge (y + scaledHeight) should not exceed container height + 200px
    const maxY = container.clientHeight - scaledHeight + maxBorder;

    // Only clamp if bounds are valid (max >= min)
    // If image is smaller than container, bounds might be reversed - in that case, allow free movement
    if (maxX < minX || maxY < minY) {
      // Image is smaller than container, allow free movement within reason
      return { x, y };
    }

    // Clamp the position
    const clampedX = Math.max(minX, Math.min(maxX, x));
    const clampedY = Math.max(minY, Math.min(maxY, y));

    return { x: clampedX, y: clampedY };
  }, []);

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
    const clamped = clampPosition(newPosition.x, newPosition.y, scale);
    setPosition(clamped);
  }, [scale, clampPosition]);

  // Handle mouse/touch end
  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events with global listeners for better performance
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX, e.clientY);
      };

      const handleMouseUp = () => {
        handleEnd();
      };

      // Use global listeners for smoother dragging
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMove, handleEnd]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const onMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      e.preventDefault(); // Prevent default touch behavior
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
      pinchStartRef.current = null; // Reset pinch state on single touch
    } else if (e.touches.length === 2) {
      // Initialize pinch zoom
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Calculate center point between the two touches
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        pinchStartRef.current = {
          distance,
          scale,
          center: {
            x: centerX - rect.left,
            y: centerY - rect.top,
          },
        };
      }
      setIsDragging(false); // Stop dragging when pinching starts
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && !pinchStartRef.current) {
      e.preventDefault(); // Only prevent default when dragging
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    } else if (e.touches.length === 2 && pinchStartRef.current) {
      // Pinch zoom with reduced sensitivity
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      // Calculate scale change based on ratio of distances
      // Apply damping factor (0.5) to reduce sensitivity
      const distanceRatio = currentDistance / pinchStartRef.current.distance;
      const scaleChange = (distanceRatio - 1) * 0.5 + 1; // Damping: 50% sensitivity
      // Limit zoom out to 1.2x (minimum scale = 1/1.2 ≈ 0.833) and zoom in to 2x (maximum scale = 2)
      const newScale = Math.max(0.833, Math.min(2, pinchStartRef.current.scale * scaleChange));
      
      // Calculate center point of current pinch
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const currentCenter = {
          x: centerX - rect.left,
          y: centerY - rect.top,
        };
        
        // Zoom towards the center of the pinch
        const scaleRatio = newScale / pinchStartRef.current.scale;
        const newX = currentCenter.x - (currentCenter.x - positionRef.current.x) * scaleRatio;
        const newY = currentCenter.y - (currentCenter.y - positionRef.current.y) * scaleRatio;
        
        setScale(newScale);
        const clamped = clampPosition(newX, newY, newScale);
        setPosition(clamped);
      }
    }
  };

  const onTouchEnd = () => {
    handleEnd();
    pinchStartRef.current = null; // Reset pinch state
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
    // Limit zoom out to 1.2x (minimum scale = 1/1.2 ≈ 0.833) and zoom in to 2x (maximum scale = 2)
    const newScale = Math.max(0.833, Math.min(2, scale + delta));
    const scaleChange = newScale / scale;
    
    // Zoom towards mouse position
    const newX = mouseX - (mouseX - position.x) * scaleChange;
    const newY = mouseY - (mouseY - position.y) * scaleChange;
    
    setScale(newScale);
    const clamped = clampPosition(newX, newY, newScale);
    setPosition(clamped);
  }, [scale, position, clampPosition]);

  // Center the image on initial load
  useEffect(() => {
    if (imageLoaded && containerRef.current && imageRef.current) {
      const container = containerRef.current;
      const image = imageRef.current;
      
      // Center the image initially
      const centerX = (container.clientWidth - image.naturalWidth) / 2;
      const centerY = (container.clientHeight - image.naturalHeight) / 2;
      
      const clamped = clampPosition(centerX, centerY, scale);
      setPosition(clamped);
    }
  }, [imageLoaded, scale, clampPosition]);

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
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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



