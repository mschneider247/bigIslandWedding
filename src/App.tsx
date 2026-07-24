import { useState, useEffect } from 'react';
import MapViewer from './components/MapViewer';
import FloatingLabel from './components/FloatingLabel';
import MarkerDevPanel from './components/MarkerDevPanel';
import PaymentMethods from './components/PaymentMethods';
import TravelOptions from './components/travelOptions';
import Schedule from './components/Schedule';
import ThingsToDo from './components/ThingsToDo';
import QandA from './components/QandA';
import ContactInfo from './components/ContactInfo';
import Auth from './components/Auth';
import { config, weddingLocations } from './config';
import { onAuthChange, type User } from './lib/firebase';
import './App.css';

function App() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isThingsToDoModalOpen, setIsThingsToDoModalOpen] = useState(false);
  const [isQaModalOpen, setIsQaModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [markerOverrides, setMarkerOverrides] = useState<Record<string, { x: number; y: number }>>({});
  // Add ?editPins to the URL to drag-tune pin coordinates and copy the result back into config.ts
  const [isMarkerEditMode] = useState(() => new URLSearchParams(window.location.search).has('editPins'));

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Greet first-time visitors with the wedding day details, once per browser
  useEffect(() => {
    if (localStorage.getItem('weddingDetailsSeen')) return;

    const timer = setTimeout(() => {
      setIsScheduleModalOpen(true);
      localStorage.setItem('weddingDetailsSeen', 'true');
    }, 800);

    return () => clearTimeout(timer);
  }, []);

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

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleRequestAuth = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    // The user state will be updated automatically via onAuthChange
  };

  const handleMarkerMove = (id: string, x: number, y: number) => {
    setMarkerOverrides((prev) => ({ ...prev, [id]: { x, y } }));
  };

  const liveMarkers = weddingLocations.map((loc) => ({ ...loc, ...markerOverrides[loc.id] }));

  return (
    <div className="app">
      <MapViewer
        mapImageUrl={config.mapImage}
        markers={liveMarkers}
        editable={isMarkerEditMode}
        onMarkerMove={handleMarkerMove}
      >
        <FloatingLabel
          title={config.mapTitle}
          description={config.mapDescription}
          onPaymentClick={handlePaymentClick}
          onTravelClick={handleTravelClick}
          onScheduleClick={handleScheduleClick}
          onThingsToDoClick={handleThingsToDoClick}
          onQaClick={handleQaClick}
          onContactClick={handleContactClick}
          isContactModalOpen={isContactModalOpen}
          legendItems={liveMarkers}
        />
      </MapViewer>
      {isMarkerEditMode && <MarkerDevPanel markers={liveMarkers} />}
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
      <ContactInfo
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
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
