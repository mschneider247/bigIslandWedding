import './FloatingLabel.css';

interface FloatingLabelProps {
  title: string;
  description: string;
  onSurveyClick: () => void;
  onPaymentClick: () => void;
  isNightMode: boolean;
  onToggleMode: () => void;
}

export default function FloatingLabel({
  title,
  description,
  onSurveyClick,
  onPaymentClick,
  isNightMode,
  onToggleMode,
}: FloatingLabelProps) {
  return (
    <div className="floating-label">
      <div className="label-content">
        <img src="/label.png" alt="Label" className="label-image" />
        <div className="day-night-toggle">
          <button
            className={`toggle-button sun-button ${!isNightMode ? 'active' : ''}`}
            onClick={onToggleMode}
            aria-label="Switch to day mode"
          >
            <svg width="96" height="96" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill={!isNightMode ? "#87CEEB" : "#555"} stroke={!isNightMode ? "#87CEEB" : "#555"} strokeWidth="1"/>
              <circle cx="12" cy="12" r="5" fill={!isNightMode ? "#FFD700" : "#555"} stroke={!isNightMode ? "#FFD700" : "#555"} strokeWidth="1"/>
              <path d="M12 1v3M12 20v3M23 12h-3M4 12H1M19.07 4.93l-2.12 2.12M6.05 17.95l-2.12 2.12M19.07 19.07l-2.12-2.12M6.05 6.05l-2.12-2.12" stroke={!isNightMode ? "#FFD700" : "#555"} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            className={`toggle-button moon-button ${isNightMode ? 'active' : ''}`}
            onClick={onToggleMode}
            aria-label="Switch to night mode"
          >
            <svg width="96" height="96" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" fill="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <h2 className="label-title">{title}</h2>
        <p className="label-description">{description}</p>
        <div className="label-buttons">
          <button className="label-button survey-button" onClick={onSurveyClick}>
            RSVP
          </button>
          <button className="label-button payment-button" onClick={onPaymentClick}>
            Gift
          </button>
        </div>
      </div>
    </div>
  );
}

