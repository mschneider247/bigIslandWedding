import './PaymentMethods.css';

interface ThingsToDoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThingsToDo({ isOpen, onClose }: ThingsToDoProps) {
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
        <h2 className="payment-modal-title">Things to do on the Big Island</h2>
        <div className="payment-options">
          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Hilo vs. Kona sides of the island</h3>
            </div>
            <p className="payment-option-description">
              Leeward/eastern vs. windward/western.
            </p>
            <p className="payment-option-description">
              <strong>Hilo:</strong> Wet and tropical, cliffside waves, turtle cove swimming and snorkeling,
              Volcano National Park, black sand beaches, Malama Market,
              Hawaiian Vanilla Company, Akaka Falls, Hawaii Tropical Botanical Garden, Hilo International Airport,
              and the ceremony/reception.
            </p>
            <p className="payment-option-description">
              <strong>Kona:</strong> Dry and sandy, warm swimming-friendly beaches, rocky snorkeling beaches,
              resorts galore, Kona Brewing, Captain Cook and Shark Temple Heiau,
              Costco, coffee farms and shops, Kona International Airport, and the honeymoon retreat.
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Hawaii Map</h3>
            </div>
            <a
              href="https://earth.google.com/earth/d/129Ax4U6UHsjyfVA1fXURoh5uqko0Z7NZ?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="payment-option-button secondary"
            >
              Open Google Earth map
            </a>
            <p className="payment-option-description">
              A map of the big island, pinned with locations featured on the same map that's on the
              invitations and the website. We encourage you to explore and zoom in on the website map,
              then go look up those locations on the Google Earth map. We tried to include some of our
              favorite places, including the ceremony location at Maku'u Point and reception at the
              Schneider/Schilhab residence in Hawaiian Paradise Park.
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Guide books</h3>
            </div>
            <p className="payment-option-description">
              <a
                href="https://www.nativebookshawaii.org/products/hawaii-the-big-island-revealed-the-ultimate-guidebook"
                target="_blank"
                rel="noopener noreferrer"
                className="payment-option-button secondary"
              >
                Hawaii The Big Island Revealed: the ultimate guidebook
              </a>
            </p>
            <p className="payment-option-description">
              Guide to beaches, history, volcanos, and tropical sights to be
              had on the big island. Comes with many nice maps and pictures of the locations.
            </p>
            <p className="payment-option-description">
              <a
                href="https://www.nativebookshawaii.org/products/unfamiliar-fishes?_pos=2&_sid=b72ed2452&_ss=r"
                target="_blank"
                rel="noopener noreferrer"
                className="payment-option-button secondary"
              >
                Unfamiliar Fishes
              </a>
            </p>
            <p className="payment-option-description">
              Perspective on the beguiling, tragic, yet beautiful history behind
              the 50th state. Hawaiians and Pacific Islanders in general have a complex relationship with
              the continental USA. If you don't know how to feel about being a tourist in Hawaii,
              you'll get a glimpse of Hawaiian dynasties, religious colonialism, and plate
              lunches in this book.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
