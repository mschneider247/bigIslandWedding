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
      <div className="payment-modal info-modal">
        <button className="payment-modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="payment-modal-title">Travel Details and Suggestions</h2>
        <div className="payment-options">
          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Getting In</h3>
            </div>
            <p className="payment-option-description">
              September is a cheaper, off-season month to fly to Hawaii. We hope that encourages you to
              plan a vacation with us!
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Kona International Airport</h3>
            </div>
            <p className="payment-option-description">
              Cheaper to fly than the majority of the year, especially into Kona.
            </p>
            <p className="payment-option-description">
              Southwest is our go-to airline, but plenty of other airline options exist. United is not bad
              either, pricing is competitive.
            </p>
            <p className="payment-option-description">
              An hour and a half drive across Saddle Road to get from Kona International Airport to the
              Puna/Hilo area. If you want to be closer to the beaches for most of your stay, fly and lodge
              closer to Kona. You will be an hour and a half away from the reception and ceremony location.
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Hilo International Airport</h3>
            </div>
            <p className="payment-option-description">
              Slightly more expensive to fly into than Kona.
            </p>
            <p className="payment-option-description">
              A half hour drive from Hilo International Airport to the Schneider/Schilhab residence in
              Hawaiian Paradise Park. If you want to be closer to the ceremony and reception for most of
              your stay, fly and lodge closer to Hilo, Keaau, or Pahoa.
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Lodging, rentals, carpools</h3>
            </div>
            <p className="payment-option-description">
              Whether you choose to stay on the Hilo or Kona side of the island, renting a car is the best
              way to get around. We will try to carpool and accommodate it among the guests for the
              ceremony and reception. Uber is available on the island too. Airbnb and Vrbo are the best
              options for a budget deal on lodgings. Resorts and hotels are also an option, but will be more
              expensive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
