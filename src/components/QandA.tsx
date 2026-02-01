import './PaymentMethods.css';

interface QandAProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QandA({ isOpen, onClose }: QandAProps) {
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
        <h2 className="payment-modal-title">Q&amp;A</h2>
        <div className="payment-options">
          <div className="payment-option">
            <div className="payment-option-header">
              <h3>When is the RSVP deadline?</h3>
            </div>
            <p className="payment-option-description">
              March 15th is our deadline to start making party arrangements, so we need a head count
              to move forward. If you need help with planning your trip, reach out to Connor or Michael.
              We know it's a big adventure to commit to, but we encourage you to consider this the
              perfect excuse to plan a trip to Hawaii.
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Can I bring a date?</h3>
            </div>
            <p className="payment-option-description">
              Yes, just let us know how many so we can arrange catering for the right amount of people.
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Are kids welcome?</h3>
            </div>
            <p className="payment-option-description">
              Yes, but there will be loud music of all kinds, three dogs, and possibly some adult
              shenanigans. If your parenting game is strong, bring them along.
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>What will the weather be like in Hawaii during September?</h3>
            </div>
            <p className="payment-option-description">
              Dry season, especially on the leeward (western) side of the island. The windward (eastern)
              side will still have some rainy days, highs in the 80s.
            </p>
            <p className="payment-option-description">
              Off-season, less crowds at the beaches, national parks, and restaurants.
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Is the wedding indoors or outdoors?</h3>
            </div>
            <p className="payment-option-description">
              The ceremony will take place on a rugged coastal spot, with lava rock cliffs, intense ocean waves and spectacular sunrises.
              Maku'u Point. Seating will be provided if requested. It is a public space, which we will
              use for a short period of time, then the reception will be back at the
              Schneider/Schilhab residence. There are two houses with an adjoining lawn.
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>What kind of shoes should/shouldn't I wear?</h3>
            </div>
            <p className="payment-option-description">
              Water-resistant sandals with some grip recommended for Maku'u Point. Some walking on
              uneven ground. Dancing shoes/sandals or barefoot for the reception.
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>What kind of attire should/shouldn't I wear?</h3>
            </div>
            <p className="payment-option-description">
              We are encouraging
              everyone to bring your best ren faire inspired outfit to Hawaii. Think breathable fabrics and light, relaxed layers,
               seaside vibes. Teal and wine-red are the official colors for the bride and groom.
              You can wear any colors you fancy, except, please no white. For inspiration, picture the look of "A Knight's Tale"
              movie or "Star Trek: The Next Generation" casual, a modern take on medieval charm. Reach out if you have any questions!
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Is it okay to take pictures with our phones and cameras during the wedding?</h3>
            </div>
            <p className="payment-option-description">
              Yes, please do! We won't have an official photographer, we would love for you to help us
              capture the moment on your more than capable smartphones.
            </p>
          </div>

          <div className="payment-option">
            <div className="payment-option-header">
              <h3>Whom should I contact with questions?</h3>
            </div>
            <p className="payment-option-description">
              Connor or Michael. If you don't have our numbers, reach out via Facebook, Instagram, email,
              etc.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
