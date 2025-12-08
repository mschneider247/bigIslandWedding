import './FloatingLabel.css';

interface FloatingLabelProps {
  title: string;
  description: string;
  onSurveyClick: () => void;
  onPaymentClick: () => void;
}

export default function FloatingLabel({
  title,
  description,
  onSurveyClick,
  onPaymentClick,
}: FloatingLabelProps) {
  return (
    <div className="floating-label">
      <div className="label-content">
        <img src="/label.png" alt="Label" className="label-image" />
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

