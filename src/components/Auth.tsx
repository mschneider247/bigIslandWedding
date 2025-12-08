import { useState, useEffect } from 'react';
import { signIn, signUp, getCurrentUser } from '../lib/firebase';
import './Auth.css';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

type AuthMode = 'login' | 'signup' | 'privacy';

export default function Auth({ isOpen, onClose, onAuthSuccess }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode('login');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setShowPrivacy(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Check if user is already logged in
    if (isOpen && getCurrentUser()) {
      onAuthSuccess();
      onClose();
    }
  }, [isOpen, onAuthSuccess, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        // Validate passwords match
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        // Validate password strength
        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        await signUp(email, password);
      } else {
        await signIn(email, password);
      }

      // Success - close modal and notify parent
      onAuthSuccess();
      onClose();
    } catch (error: any) {
      let errorMessage = 'An error occurred';
      
      if (error?.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (error?.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error?.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error?.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error?.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose}>
          ×
        </button>

        {showPrivacy ? (
          <PrivacyInfo onBack={() => setShowPrivacy(false)} />
        ) : (
          <>
            <h2 className="auth-modal-title">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>

            <p className="auth-modal-subtitle">
              {mode === 'login' 
                ? 'Sign in to access payment features'
                : 'Create an account to make secure payments'}
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                  minLength={mode === 'signup' ? 6 : undefined}
                  disabled={loading}
                />
              </div>

              {mode === 'signup' && (
                <div className="auth-form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    minLength={6}
                    disabled={loading}
                  />
                </div>
              )}

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              <button
                type="button"
                className="auth-toggle-mode"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                disabled={loading}
              >
                {mode === 'login'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>

              <button
                type="button"
                className="auth-privacy-link"
                onClick={() => setShowPrivacy(true)}
              >
                Privacy & Security Information
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PrivacyInfo({ onBack }: { onBack: () => void }) {
  return (
    <div className="privacy-info">
      <h2 className="auth-modal-title">Privacy & Security</h2>
      
      <div className="privacy-section">
        <h3>Developer Information</h3>
        <p>
          Michael is the sole developer of this application. Please reach out with any questions or concerns. 
          Always happy to delete accounts and associated data if that's what you want.
        </p>
      </div>

      <div className="privacy-section">
        <h3>How Your Data is Secured</h3>
        <p>
          Your personal data and payment information are secured through Firebase, Google's enterprise-grade 
          cloud platform. Here's how your data is protected:
        </p>
        <ul>
          <li>
            <strong>Firebase Authentication:</strong> Your login credentials are encrypted and stored securely 
            using Firebase Authentication, which follows industry-standard security practices including 
            password hashing with bcrypt.
          </li>
          <li>
            <strong>Firebase Security Rules:</strong> Access to your data is controlled by Firebase Security 
            Rules, ensuring only you can access your own information.
          </li>
          <li>
            <strong>HTTPS Encryption:</strong> All data transmission between your device and our servers is 
            encrypted using HTTPS/TLS protocols.
          </li>
          <li>
            <strong>Stripe Payment Security:</strong> Payment processing is handled by Stripe, a PCI-DSS Level 1 
            certified payment processor. We never store your full credit card details - Stripe handles all 
            payment data securely.
          </li>
          <li>
            <strong>Firebase Compliance:</strong> Firebase complies with major security and privacy standards 
            including SOC 2 Type II, ISO 27001, and GDPR.
          </li>
        </ul>
      </div>

      <div className="privacy-section">
        <h3>Data We Collect</h3>
        <p>We collect only the minimum necessary information:</p>
        <ul>
          <li>Email address (for account creation and login)</li>
          <li>Payment transaction records (processed securely through Stripe)</li>
        </ul>
      </div>

      <div className="privacy-section">
        <h3>Your Rights</h3>
        <p>
          You have the right to access, modify, or delete your account and associated data at any time. 
          Simply contact Michael to request account deletion or data modification.
        </p>
      </div>

      <button
        type="button"
        className="auth-back-button"
        onClick={onBack}
      >
        ← Back
      </button>
    </div>
  );
}
