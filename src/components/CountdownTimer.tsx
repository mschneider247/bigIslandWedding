import { useState, useEffect } from 'react';
import './CountdownTimer.css';

interface CountdownTimerProps {
  targetDate: Date;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="countdown-timer">
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.days}</span>
        <span className="countdown-label">{timeLeft.days === 1 ? 'Day' : 'Days'}</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="countdown-label">{timeLeft.hours === 1 ? 'Hour' : 'Hours'}</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item">
        <span className="countdown-value">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span className="countdown-label">{timeLeft.minutes === 1 ? 'Minute' : 'Minutes'}</span>
      </div>
      <span className="countdown-separator">:</span>
      <div className="countdown-item">
        <span key={timeLeft.seconds} className="countdown-value countdown-tick">{timeLeft.seconds.toString().padStart(2, '0')}</span>
        <span className="countdown-label">{timeLeft.seconds === 1 ? 'Second' : 'Seconds'}</span>
      </div>
    </div>
  );
}


