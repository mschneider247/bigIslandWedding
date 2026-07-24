import './PaymentMethods.css';
import { useEscapeClose } from '../hooks/useEscapeClose';

interface ContactInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactInfo({
  isOpen,
  onClose,
}: ContactInfoProps) {
  useEscapeClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={handleOverlayClick}>
      <div className="payment-modal" style={{ maxWidth: '500px', paddingTop: '48px' }}>
        <button className="payment-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="payment-options">
          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Whom should I contact with questions?</h3>
            </div>
            <p className="payment-option-description" style={{ marginBottom: 0 }}>
              Connor or Michael. If you don't have our numbers, reach out via Facebook, Instagram, email, or via the return address on the invitation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
