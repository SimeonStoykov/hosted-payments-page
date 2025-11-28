import { useState, useLayoutEffect } from 'react';
import { Quote } from '../lib/api';

interface CountdownResult {
  timeLeft: string;
  isExpired: boolean;
}

export function useCountdown(
  expiryTimestamp?: Quote['acceptanceExpiryDate'],
): CountdownResult {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState<boolean>(() => {
    if (!expiryTimestamp) return false;
    return Date.now() >= expiryTimestamp;
  });

  useLayoutEffect(() => {
    if (!expiryTimestamp) {
      return;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = expiryTimestamp - now;

      if (difference <= 0) {
        setIsExpired(true);
        return;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      );
      setIsExpired(false);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [expiryTimestamp]);

  return { timeLeft, isExpired };
}
