import './PaymentMethods.css';

interface TravelOptionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TravelOptions({ isOpen, onClose }: TravelOptionsProps) {
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
        <h2 className="payment-modal-title">Travel</h2>
        <div className="payment-options">
          <div className="payment-option">
            <div className="payment-option-header">
              <h3>In a far away land, surrounded by water...</h3>
            </div>
            <p className="payment-option-description">
              Fly into Hilo or Kona. Hilo Airport is about 30mins from the reception/ceremony location, and Kona Airport is about 2 and a half hours. 
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Its Hawaii</h3>
            </div>
            <p className="payment-option-description">
              The Big Island, active volcano, tropical paradise, home of Kahmehameha the Great!
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Lodging Ideas</h3>
            </div>
            <p className="payment-option-description">
              Stay near Hilo, if you want to be close to the venue! Stay near Kona, if you want to be close to the beach!
            </p>
            <p className="payment-option-description">
              We'll be primarily at the Schneider/Schilab residence in Hawaiian Paradise Park, just south of Hilo. That will also
              be the location of the reception, with the ceremony taking place just down the road at Maku'u Point.
            </p>
            <p className="payment-option-description">
              Watch out for goats on Saddle road!
            </p>
          </div>

          <div className="payment-option">
            <p className="payment-option-description">
              <a
                href="https://www.vrbo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="payment-option-button secondary"
              >
                vrbo.com
              </a>
            </p>
            <p className="payment-option-description">Hilo, HI, USA</p>
            <p className="payment-option-description">Hawaiian Paradise Park, HI, USA</p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Things to do on the big island</h3>
            </div>
            <ul className="payment-option-description" style={{ paddingLeft: '20px' }}>
              <li>Hawaii Volcanoes National Park</li>
              <li>Akaka Falls State Park</li>
              <li>Tropical Botanical Garden</li>
              <li>Hapuna Beach, Beach 69</li>
              <li>Kona Brewery</li>
              <li>HI Vanilla Company</li>
              <li>Mauna Kea Summit, 13,803ft</li>
              <li>Where Cpt Cook met island justice, Kapu Kapu!</li>
              <li>Shark temple, built in shark infested waters!</li>
            </ul>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Between adventures</h3>
            </div>
            <p className="payment-option-description">
              Rent some wheels so you can explore! We'll carpool when able, but space might be limited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
