import './PaymentMethods.css';

interface ScheduleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Schedule({ isOpen, onClose }: ScheduleProps) {
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
        <h2 className="payment-modal-title">Schedule</h2>
        <div className="payment-options">
          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Ceremony</h3>
            </div>
            <p className="payment-option-description">
              We will carpool from the Schneider/Schilhab residence on September 14th, 2026 to
              Maku'u Point, exact time of day TBD.
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Reception</h3>
            </div>
            <p className="payment-option-description">
              Party with us at the Schneider/Schilhab residence in Hawaiian Paradise Park on
              September 14th, 2026, after the ceremony. Exact time of day TBD.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
