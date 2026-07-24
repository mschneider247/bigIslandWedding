import { useRef } from 'react';
import CountdownTimer from './CountdownTimer';
import MapLegend from './MapLegend';
import './FloatingLabel.css';

// Get the wedding date: September 14, 2026 at 10:00 AM HST (Hawaii-Aleutian Standard Time),
// when the ceremony begins at Maku'u Point. HST is UTC-10, so 10:00 AM HST = 20:00 UTC.
function getWeddingDate(): Date {
  return new Date(Date.UTC(2026, 8, 14, 20, 0, 0)); // Month is 0-indexed, so 8 = September
}

interface LegendItem {
  id: string;
  label: string;
  time: string;
  color: string;
}

interface FloatingLabelProps {
  title: string;
  description: string;
  onPaymentClick: () => void;
  onTravelClick: () => void;
  onScheduleClick: () => void;
  onThingsToDoClick: () => void;
  onQaClick: () => void;
  onContactClick: () => void;
  isContactModalOpen?: boolean;
  legendItems?: LegendItem[];
}

export default function FloatingLabel({
  title,
  description,
  onPaymentClick,
  onTravelClick,
  onScheduleClick,
  onThingsToDoClick,
  onQaClick,
  onContactClick,
  isContactModalOpen = false,
  legendItems = [],
}: FloatingLabelProps) {
  // Track if a touch event occurred to prevent double-firing with click
  const touchHandledRef = useRef(false);

  // Handle touch events for better compatibility with older devices
  const handleTouchStart = (e: React.TouchEvent, handler: () => void) => {
    e.stopPropagation(); // Prevent map viewer from capturing the touch
    touchHandledRef.current = true;
    handler();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    // Reset after a short delay to allow click event to be suppressed
    setTimeout(() => {
      touchHandledRef.current = false;
    }, 300);
  };

  // Wrapper for onClick to prevent double-firing when touch was used
  const handleClick = (e: React.MouseEvent, handler: () => void) => {
    if (touchHandledRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    handler();
  };

  return (
    <div className="floating-label">
      <div className="label-content">
        <img src="/label.png" alt="Label" className="label-image" />
        <div className="label-icon-row">
          <button
            className={`toggle-button contact-button ${isContactModalOpen ? 'active' : ''}`}
            onClick={(e) => handleClick(e, onContactClick)}
            onTouchStart={(e) => handleTouchStart(e, onContactClick)}
            onTouchEnd={handleTouchEnd}
            aria-label="Contact information"
          >
            <svg width="96" height="96" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
              <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="bold" fill="currentColor">i</text>
            </svg>
          </button>
        </div>
        <h2 className="label-title">{title}</h2>
        <p className="label-description">{description}</p>
        <CountdownTimer targetDate={getWeddingDate()} />
        <div className="label-buttons">
          <button
            className="label-button payment-button"
            onClick={(e) => handleClick(e, onPaymentClick)}
            onTouchStart={(e) => handleTouchStart(e, onPaymentClick)}
            onTouchEnd={handleTouchEnd}
          >
            Gift
          </button>
          <div className="label-button-row">
            <button 
              className="label-button icon-button travel-button" 
              onClick={(e) => handleClick(e, onTravelClick)}
              onTouchStart={(e) => handleTouchStart(e, onTravelClick)}
              onTouchEnd={handleTouchEnd}
              aria-label="Travel info"
              title="Travel"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9L2 14v2l8-2.5V19l-2 1.5V22l3-1 3 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor" />
              </svg>
            </button>
            <button 
              className="label-button icon-button schedule-button" 
              onClick={(e) => handleClick(e, onScheduleClick)}
              onTouchStart={(e) => handleTouchStart(e, onScheduleClick)}
              onTouchEnd={handleTouchEnd}
              aria-label="Schedule"
              title="Schedule"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="3" cy="6" r="1.5" fill="currentColor"/>
                <circle cx="3" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="3" cy="18" r="1.5" fill="currentColor"/>
              </svg>
            </button>
            <button 
              className="label-button icon-button todo-button" 
              onClick={(e) => handleClick(e, onThingsToDoClick)}
              onTouchStart={(e) => handleTouchStart(e, onThingsToDoClick)}
              onTouchEnd={handleTouchEnd}
              aria-label="Things to do"
              title="Things to do"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="label-button icon-button qa-button" 
              onClick={(e) => handleClick(e, onQaClick)}
              onTouchStart={(e) => handleTouchStart(e, onQaClick)}
              onTouchEnd={handleTouchEnd}
              aria-label="Questions and answers"
              title="Q&A"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 5h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <text x="7" y="14.5" fontSize="7" fontFamily="Arial, sans-serif" fill="currentColor">Q&A</text>
              </svg>
            </button>
          </div>
        </div>
        <MapLegend items={legendItems} />
      </div>
    </div>
  );
}

