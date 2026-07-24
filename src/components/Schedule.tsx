import './PaymentMethods.css';
import { useEscapeClose } from '../hooks/useEscapeClose';

interface ScheduleProps {
  isOpen: boolean;
  onClose: () => void;
}

// Wedding day timeline, in Hawaii-Aleutian Standard Time (UTC-10, no DST).
const CALENDAR_START_UTC = '20260914T200000Z'; // 10:00 AM HST
const CALENDAR_END_UTC = '20260915T030000Z'; // 5:00 PM HST

function buildGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: "Connor & Michael's Wedding",
    dates: `${CALENDAR_START_UTC}/${CALENDAR_END_UTC}`,
    details:
      "10:00-11:00am Ceremony & pictures at Maku'u Point (no on-site parking or restrooms - carpool from the Schneider/Schilhab house). 11:00am-5:00pm Reception & games at the Schneider/Schilhab residence.",
    location: "Maku'u Point & Schneider/Schilhab residence, Hawaiian Paradise Park, HI",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function Schedule({ isOpen, onClose }: ScheduleProps) {
  useEscapeClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={handleOverlayClick}>
      <div className="payment-modal info-modal">
        <button className="payment-modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="payment-modal-title">The Big Day - September 14, 2026</h2>
        <div className="payment-options">
          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Ceremony & Pictures</h3>
              <span className="payment-badge">10 - 11 AM</span>
            </div>
            <p className="payment-option-description">
              At Maku'u Point. There's no official parking lot or restrooms out there, so carpool
              from the Schneider/Schilhab house if you can.
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Reception & Games</h3>
              <span className="payment-badge">11 AM - 5 PM</span>
            </div>
            <p className="payment-option-description">
              Back at the Schneider/Schilhab house 'til 5pm, or whenever we're too tired to carry on.
              First and foremost, a dance party - plus squirt guns, board games, and badminton (a
              tournament may break out). Catered food and drinks, both alcoholic and non - we're
              going light on the bar, so bring extra if you want to keep it going.
            </p>
            <p className="payment-option-description">
              See our Hawaii Google Earth map for exact locations
            </p>
            <a
              href="https://earth.google.com/earth/d/129Ax4U6UHsjyfVA1fXURoh5uqko0Z7NZ?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="payment-option-button secondary"
            >
              Open Google Earth map
            </a>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Then, we vanish 🌺</h3>
              <span className="payment-badge">Sept 15 - 16</span>
            </div>
            <p className="payment-option-description">
              After a final toast, we're off to the Westin Hapuna Beach Resort. The wedding night's
              just for us, but if you're on the Kona side Sept 15-16, come find us for swimming and
              sunset by the waves.
            </p>
          </div>

          <a
            href={buildGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="payment-option-button primary"
          >
            Add wedding day to calendar
          </a>
        </div>
      </div>
    </div>
  );
}
