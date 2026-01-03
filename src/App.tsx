import { useState } from 'react';
import MapViewer from './components/MapViewer';
import FloatingLabel from './components/FloatingLabel';
import PaymentMethods from './components/PaymentMethods';
import { config } from './config';
import './App.css';

function App() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState<'sun' | 'moon' | null>(null);

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
      />
      </div>
  );
}

export default App;
