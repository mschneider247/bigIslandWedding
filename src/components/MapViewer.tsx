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
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Check if position is too far off screen (for reset)
  const isPositionOffScreen = useCallback((pos: { x: number; y: number }, currentScale: number) => {
    if (!containerRef.current || !imageRef.current || !imageLoaded) {
      return false;
    }

    const container = containerRef.current;
    const image = imageRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const scaledWidth = image.naturalWidth * currentScale;
    const scaledHeight = image.naturalHeight * currentScale;

    // Calculate bounds
    const minX = containerWidth - scaledWidth;
    const maxX = 0;
    const minY = containerHeight - scaledHeight;
    const maxY = 0;

    // Check if position is way outside bounds (more than 50% of container size)
    const thresholdX = containerWidth * 0.5;
    const thresholdY = containerHeight * 0.5;
    
    return (
      pos.x > maxX + thresholdX ||
      pos.x < minX - thresholdX ||
      pos.y > maxY + thresholdY ||
      pos.y < minY - thresholdY
    );
  }, [imageLoaded]);

  // Calculate bounds and clamp position
  const clampPosition = useCallback((pos: { x: number; y: number }, currentScale: number) => {
    if (!containerRef.current || !imageRef.current || !imageLoaded) {
      return pos;
    }

    const container = containerRef.current;
    const image = imageRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const scaledWidth = image.naturalWidth * currentScale;
    const scaledHeight = image.naturalHeight * currentScale;

    // Calculate bounds: image should not go beyond container edges
    // If scaled image is larger than container, clamp to prevent edges from going past container
    // If scaled image is smaller than container, allow movement but keep it within container bounds
    let minX: number, maxX: number, minY: number, maxY: number;
    
    if (scaledWidth > containerWidth) {
      // Image is larger: prevent left edge from going past right, and right edge from going past left
      minX = containerWidth - scaledWidth; // Most right position (left edge at right side)
      maxX = 0; // Most left position (left edge at left side)
    } else {
      // Image is smaller: allow it to move but keep it within container
      minX = 0; // Can't move left past container edge
      maxX = containerWidth - scaledWidth; // Can't move right past container edge
    }
    
    if (scaledHeight > containerHeight) {
      // Image is larger: prevent top edge from going past bottom, and bottom edge from going past top
      minY = containerHeight - scaledHeight; // Most bottom position (top edge at bottom)
      maxY = 0; // Most top position (top edge at top)
    } else {
      // Image is smaller: allow it to move but keep it within container
      minY = 0; // Can't move up past container edge
      maxY = containerHeight - scaledHeight; // Can't move down past container edge
    }

    // Clamp position within bounds - ensure it never goes outside
    return {
      x: Math.max(minX, Math.min(maxX, pos.x)),
      y: Math.max(minY, Math.min(maxY, pos.y)),
    };
  }, [imageLoaded]);

  // Reset map to center position
  const resetMap = useCallback(() => {
    if (!containerRef.current || !imageRef.current || !imageLoaded) {
      return;
    }

    const container = containerRef.current;
    const image = imageRef.current;
    
    // Reset to center with scale 1
    const centerX = (container.clientWidth - image.naturalWidth) / 2;
    const centerY = (container.clientHeight - image.naturalHeight) / 2;
    
    setScale(1);
    setPosition({ x: centerX, y: centerY });
  }, [imageLoaded]);

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
    const clampedPosition = clampPosition(newPosition, scaleRef.current);
    setPosition(clampedPosition);
  }, [clampPosition]);

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
        const clampedPosition = clampPosition(newPosition, scaleRef.current);
        setPosition(clampedPosition);
        
        // Check if position is off screen and schedule reset
        if (isPositionOffScreen(clampedPosition, scaleRef.current)) {
          if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
          }
          resetTimeoutRef.current = setTimeout(() => {
            resetMap();
          }, 500);
        } else {
          if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
            resetTimeoutRef.current = null;
          }
        }
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
        
        // Limit zoom more strictly on mobile (detect via touch)
        const isMobile = window.innerWidth <= 768;
        const minScale = isMobile ? 0.6 : 0.4;
        const maxScale = isMobile ? 1.5 : 2;
        const newScale = Math.max(minScale, Math.min(maxScale, pinchStartRef.current.scale * scaleChange));
        
        // Use center of viewport instead of pinch center
        const centerX = container.clientWidth / 2;
        const centerY = container.clientHeight / 2;
        
        const scaleRatio = newScale / pinchStartRef.current.scale;
        const newX = centerX - (centerX - positionRef.current.x) * scaleRatio;
        const newY = centerY - (centerY - positionRef.current.y) * scaleRatio;
        
        const clampedPosition = clampPosition({ x: newX, y: newY }, newScale);
        setScale(newScale);
        setPosition(clampedPosition);
        
        // Check if position is off screen and schedule reset
        if (isPositionOffScreen(clampedPosition, newScale)) {
          if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
          }
          resetTimeoutRef.current = setTimeout(() => {
            resetMap();
          }, 500);
        } else {
          if (resetTimeoutRef.current) {
            clearTimeout(resetTimeoutRef.current);
            resetTimeoutRef.current = null;
          }
        }
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      pinchStartRef.current = null;
      
      // Final check after touch ends - if map is off screen, reset it
      if (isPositionOffScreen(positionRef.current, scaleRef.current)) {
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current);
        }
        resetTimeoutRef.current = setTimeout(() => {
          resetMap();
        }, 300);
      }
    };

    // Use native listeners with passive: false to allow preventDefault
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, [clampPosition, isPositionOffScreen, resetMap]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const onMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  // Wheel zoom - zoom towards center of viewport
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current || !imageRef.current) return;
    
    const container = containerRef.current;
    // Use center of viewport instead of mouse position
    const centerX = container.clientWidth / 2;
    const centerY = container.clientHeight / 2;
    
    const delta = e.deltaY * -0.001;
    // Limit zoom out to 2.5x (minimum scale = 1/2.5 = 0.4) and zoom in to 2x (maximum scale = 2)
    const newScale = Math.max(0.4, Math.min(2, scale + delta));
    const scaleChange = newScale / scale;
    
    // Zoom towards center of viewport
    const newX = centerX - (centerX - position.x) * scaleChange;
    const newY = centerY - (centerY - position.y) * scaleChange;
    
    const clampedPosition = clampPosition({ x: newX, y: newY }, newScale);
    setScale(newScale);
    setPosition(clampedPosition);
  }, [scale, position, clampPosition]);

  // Center the image on initial load
  useEffect(() => {
    if (imageLoaded && containerRef.current && imageRef.current) {
      const container = containerRef.current;
      const image = imageRef.current;
      
      // Center the image initially
      const centerX = (container.clientWidth - image.naturalWidth) / 2;
      const centerY = (container.clientHeight - image.naturalHeight) / 2;
      
      const clampedPosition = clampPosition({ x: centerX, y: centerY }, scale);
      setPosition(clampedPosition);
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



