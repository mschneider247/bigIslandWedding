import { useState } from 'react';
import MapViewer from './components/MapViewer';
import FloatingLabel from './components/FloatingLabel';
import PaymentMethods from './components/PaymentMethods';
import { config } from './config';
import './App.css';

function App() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleSurveyClick = () => {
    window.open(config.surveyUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePaymentClick = () => {
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="app">
      <MapViewer mapImageUrl={config.mapImage}>
        <FloatingLabel
          title={config.mapTitle}
          description={config.mapDescription}
          onSurveyClick={handleSurveyClick}
          onPaymentClick={handlePaymentClick}
          followCursor={true}
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
