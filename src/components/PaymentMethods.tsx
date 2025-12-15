import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import './PaymentMethods.css';
import { createCheckoutSession, getCurrentUser } from '../lib/firebase';

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
  user,
  onRequestAuth,
}: PaymentMethodsProps) {
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Verify user is authenticated
  const currentUser = user || getCurrentUser();
  const isAuthenticated = !!currentUser;

  const handleSignInForCard = () => {
    if (onRequestAuth) {
      onRequestAuth();
    }
  };

  const handleCardPayment = async () => {
    if (!isAuthenticated) {
      handleSignInForCard();
      return;
    }

    const paymentAmount = parseFloat(amount);
    
    if (!paymentAmount || paymentAmount <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }

    if (paymentAmount < 0.50) {
      setError('Minimum payment amount is $0.50');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Create Stripe checkout session using the extension
      // Force HTTPS to prevent mixed content warnings
      const origin = window.location.origin.replace(/^http:/, 'https:');
      const session = await createCheckoutSession(
        paymentAmount,
        'USD',
        `${origin}/payment-success`,
        `${origin}/payment-cancel`
      );

      // If session has a URL, redirect to Stripe Checkout
      if (session && typeof session === 'object' && 'url' in session) {
        window.location.href = (session as { url: string }).url;
      } else {
        throw new Error('Invalid response from payment service');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred processing your payment');
      setProcessing(false);
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
        <p>Your presence is considered the greatest gift of all.</p>
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

          {/* Credit Card Payment Option - Second */}
          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Credit Card Payment</h3>
              {isAuthenticated && (
                <span className="payment-badge">Ready</span>
              )}
            </div>
            <p className="payment-option-description">
              Secure payment processing through Stripe
              {isAuthenticated && (
                <span className="auth-status"> ✓ Signed in as {currentUser?.email}</span>
              )}
            </p>
            
            {!isAuthenticated ? (
              <button 
                className="payment-option-button primary"
                onClick={handleSignInForCard}
              >
                Sign in for Credit Card Payment
              </button>
            ) : (
              <>
                <div className="payment-amount-input">
                  <label htmlFor="payment-amount">Amount (USD)</label>
                  <div className="amount-input-wrapper">
                    <span className="currency-symbol">$</span>
                    <input
                      id="payment-amount"
                      type="number"
                      step="0.01"
                      min="0.50"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setError('');
                      }}
                      placeholder="0.00"
                      disabled={processing}
                    />
                  </div>
                </div>

                {error && (
                  <div className="payment-error">
                    {error}
                  </div>
                )}

                <button 
                  className="payment-option-button primary"
                  onClick={handleCardPayment}
                  disabled={processing || !amount || parseFloat(amount) <= 0}
                >
                  {processing ? 'Processing...' : 'Pay with Card'}
                </button>
              </>
            )}
          </div>

          {/* Check Option - Third */}
          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Personal Check</h3>
            </div>
            <p className="payment-option-description">
              We also accept personal checks
            </p>
            {checkMailingAddress ? (
              <>
                <p className="payment-option-description" style={{ marginTop: '8px' }}>
                  Send a check to the following address:
                </p>
                <div className="mailing-address">
                  <p style={{ whiteSpace: 'pre-line' }}>{checkMailingAddress.replace(/\\n/g, '\n')}</p>
                </div>
              </>
            ) : (
              <p className="payment-option-description" style={{ marginTop: '8px' }}>
                Please contact us for mailing address
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



