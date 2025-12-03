import './PaymentMethods.css';

interface PaymentMethodsProps {
  isOpen: boolean;
  onClose: () => void;
  venmoUrl?: string;
  checkMailingAddress?: string;
}

export default function PaymentMethods({
  isOpen,
  onClose,
  venmoUrl = 'https://venmo.com',
  checkMailingAddress,
}: PaymentMethodsProps) {
  if (!isOpen) return null;

  const handleFirebasePayment = async () => {
    try {
      // Import Firebase payment function
      const { processPayment } = await import('../lib/firebase');
      
      // Prompt for amount (you can customize this)
      const amount = parseFloat(prompt('Enter payment amount:', '0') || '0');
      
      if (amount > 0) {
        await processPayment(amount);
        alert('Payment processed successfully!');
        onClose();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

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
        <h2 className="payment-modal-title">Payment Options</h2>
        
        <div className="payment-options">
          {/* Firebase Payment Option */}
          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Online Payment</h3>
              <span className="payment-badge">Recommended</span>
            </div>
            <p className="payment-option-description">
              Secure payment processing through Stripe
            </p>
            <button 
              className="payment-option-button primary"
              onClick={handleFirebasePayment}
            >
              Pay with Card
            </button>
          </div>

          {/* Venmo Option */}
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

          {/* Check Option */}
          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Check by Mail</h3>
            </div>
            {checkMailingAddress ? (
              <>
                <p className="payment-option-description">
                  Send a check to the following address:
                </p>
                <div className="mailing-address">
                  <p style={{ whiteSpace: 'pre-line' }}>{checkMailingAddress.replace(/\\n/g, '\n')}</p>
                </div>
              </>
            ) : (
              <p className="payment-option-description">
                Please contact us for mailing address
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

