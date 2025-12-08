import { useState, useEffect } from 'react';
import MapViewer from './components/MapViewer';
import FloatingLabel from './components/FloatingLabel';
import PaymentMethods from './components/PaymentMethods';
import Auth from './components/Auth';
import { config } from './config';
import { initializeFirebase, onAuthChange, getCurrentUser, logout, type User } from './lib/firebase';
import './App.css';

function App() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Initialize Firebase and listen for auth changes
  useEffect(() => {
    initializeFirebase();
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSurveyClick = () => {
    if (config.surveyUrl) {
      window.open(config.surveyUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Survey URL not configured. Please set VITE_SURVEY_URL in your .env file.');
      alert('Survey URL is not configured. Please contact the site administrator.');
    }
  };

  const handlePaymentClick = () => {
    // Always show payment modal - it will handle auth if needed
    setIsPaymentModalOpen(true);
  };

  const handleRequestAuth = () => {
    // Close payment modal and open auth modal
    setIsPaymentModalOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    // After successful auth, reopen payment modal
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Small delay to ensure auth modal closes first
      setTimeout(() => {
        setIsPaymentModalOpen(true);
      }, 100);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="app">
      <MapViewer mapImageUrl={config.mapImage}>
        <FloatingLabel
          title={config.mapTitle}
          description={config.mapDescription}
          onSurveyClick={handleSurveyClick}
          onPaymentClick={handlePaymentClick}
        />
      </MapViewer>
      
      {/* User info banner */}
      {user && (
        <div className="user-info-banner">
          <span>Signed in as {user.email}</span>
          <button onClick={handleLogout} className="logout-button">
            Sign Out
          </button>
        </div>
      )}

      <Auth
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <PaymentMethods
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        venmoUrl={config.venmoUrl}
        checkMailingAddress={config.checkMailingAddress}
        user={user}
        onRequestAuth={handleRequestAuth}
      />
    </div>
  );
}

export default App;
