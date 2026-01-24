import { useState, useEffect } from 'react';
import MapViewer from './components/MapViewer';
import FloatingLabel from './components/FloatingLabel';
import PaymentMethods from './components/PaymentMethods';
import TravelOptions from './components/travelOptions';
import Schedule from './components/Schedule';
import ThingsToDo from './components/ThingsToDo';
import QandA from './components/QandA';
import Auth from './components/Auth';
import { config } from './config';
import { onAuthChange, type User } from './lib/firebase';
import './App.css';

function App() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isThingsToDoModalOpen, setIsThingsToDoModalOpen] = useState(false);
  const [isQaModalOpen, setIsQaModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState<'sun' | 'moon' | null>(null);

  // Listen to auth state changes
  useEffect(() => {
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
    setIsPaymentModalOpen(true);
  };

  const handleTravelClick = () => {
    setIsTravelModalOpen(true);
  };

  const handleScheduleClick = () => {
    setIsScheduleModalOpen(true);
  };

  const handleThingsToDoClick = () => {
    setIsThingsToDoModalOpen(true);
  };

  const handleQaClick = () => {
    setIsQaModalOpen(true);
  };

  const handleRequestAuth = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    // The user state will be updated automatically via onAuthChange
  };

  const handleToggleMode = (buttonType: 'sun' | 'moon') => {
    // Set loading state when toggling
    setIsLoading(true);
    setLoadingButton(buttonType);
    setIsNightMode(buttonType === 'moon');
  };

  const handleImageLoad = () => {
    // Clear loading state when image loads
    setIsLoading(false);
    setLoadingButton(null);
  };

  // Determine which image to use based on night mode
  const currentMapImage = isNightMode ? config.backImage : config.mapImage;

  return (
    <div className="app">
      <MapViewer mapImageUrl={currentMapImage} onImageLoad={handleImageLoad}>
        <FloatingLabel
          title={config.mapTitle}
          description={config.mapDescription}
          onSurveyClick={handleSurveyClick}
          onPaymentClick={handlePaymentClick}
          onTravelClick={handleTravelClick}
          onScheduleClick={handleScheduleClick}
          onThingsToDoClick={handleThingsToDoClick}
          onQaClick={handleQaClick}
          isNightMode={isNightMode}
          onToggleMode={handleToggleMode}
          isLoading={isLoading}
          loadingButton={loadingButton}
        />
      </MapViewer>
      <PaymentMethods
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        venmoUrl={config.venmoUrl}
        checkMailingAddress={config.checkMailingAddress}
        user={user}
        onRequestAuth={handleRequestAuth}
      />
      <TravelOptions
        isOpen={isTravelModalOpen}
        onClose={() => setIsTravelModalOpen(false)}
      />
      <Schedule
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
      <ThingsToDo
        isOpen={isThingsToDoModalOpen}
        onClose={() => setIsThingsToDoModalOpen(false)}
      />
      <QandA
        isOpen={isQaModalOpen}
        onClose={() => setIsQaModalOpen(false)}
      />
      <Auth
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      </div>
  );
}

export default App;
