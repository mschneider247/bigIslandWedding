import { useState, useEffect } from 'react';
import './FloatingLabel.css';

interface FloatingLabelProps {
  title: string;
  description: string;
  onSurveyClick: () => void;
  onPaymentClick: () => void;
  followCursor?: boolean;
}

export default function FloatingLabel({
  title,
  description,
  onSurveyClick,
  onPaymentClick,
  followCursor = true,
}: FloatingLabelProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!followCursor || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [followCursor, isMobile]);

  // On mobile, position in bottom-right corner
  if (isMobile) {
    return (
      <div className="floating-label mobile">
        <div className="label-content">
          <h2 className="label-title">{title}</h2>
          <p className="label-description">{description}</p>
          <div className="label-buttons">
            <button className="label-button survey-button" onClick={onSurveyClick}>
              Take Survey
            </button>
            <button className="label-button payment-button" onClick={onPaymentClick}>
              Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // On desktop, follow cursor
  return (
    <div
      className="floating-label desktop"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="label-content">
        <h2 className="label-title">{title}</h2>
        <p className="label-description">{description}</p>
        <div className="label-buttons">
          <button className="label-button survey-button" onClick={onSurveyClick}>
            Take Survey
          </button>
          <button className="label-button payment-button" onClick={onPaymentClick}>
            Payment
          </button>
        </div>
      </div>
    </div>
  );
}

