import type { User } from 'firebase/auth';
import './PaymentMethods.css';
import { useEscapeClose } from '../hooks/useEscapeClose';

// Card payments via Stripe are on hold (see STRIPE_TESTING_GUIDE.md) - user/onRequestAuth
// are kept on the props contract so that flow can be re-enabled without touching App.tsx.
interface PaymentMethodsProps {
  isOpen: boolean;
  onClose: () => void;
  venmoUrl?: string;
  checkMailingAddress?: string;
  user?: User | null;
  onRequestAuth?: () => void;
}

export default function PaymentMethods({
  isOpen,
  onClose,
  venmoUrl = 'https://venmo.com',
  checkMailingAddress,
}: PaymentMethodsProps) {
  useEscapeClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="payment-modal-overlay" onClick={handleOverlayClick}>
      <div className="payment-modal">
        <button className="payment-modal-close" onClick={onClose}>
          ×
        </button>
        <p>
        Your presence is considered the greatest gift of all, however, if you would like to honor us
        with a gift, we would be grateful for any contribution to our adventure setup. It's our
        everything vehicle, from groceries to camping. We dream of paying it off to explore farther
        west, especially to see the Redwoods and Sequoias.
        </p>
        <p></p>
        <div className="truck-section">
          <img src="/truck.jpg" alt="Truck" className="truck-image" />
          <p className="truck-text">- "The Taco MAU" (Mobile Adventure Unit).</p>
        </div>

        <h2 className="payment-modal-title">Adventure Options</h2>

        <div className="payment-options">
          {/* Venmo Option - First */}
          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Venmo</h3>
            </div>
            <p className="payment-option-description">
              Send payment through Venmo
            </p>
            {venmoUrl ? (
              <a
                href={venmoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="payment-option-button secondary"
              >
                Open Venmo
              </a>
            ) : (
              <p className="payment-warning">Venmo URL not configured</p>
            )}
          </div>

          {/* Personal Check Option - Second */}
          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Personal Check</h3>
            </div>
            {checkMailingAddress && (
              <>
                <p className="payment-option-description" style={{ marginTop: '8px' }}>
                  Send to the following address:
                </p>
                <div className="mailing-address">
                  <p style={{ whiteSpace: 'pre-line' }}>{checkMailingAddress.replace(/\\n/g, '\n')}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
