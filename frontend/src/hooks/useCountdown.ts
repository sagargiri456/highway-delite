import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCountdownReturn {
  countdown: number;
  isActive: boolean;
  startCountdown: () => void;
  resetCountdown: () => void;
  restartCountdown: () => void;
}

export const useCountdown = (initialTime: number = 60): UseCountdownReturn => {
  const [countdown, setCountdown] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startCountdown = useCallback(() => {
    setCountdown(initialTime);
    setIsActive(true);
  }, [initialTime]);

  const resetCountdown = useCallback(() => {
    setCountdown(0);
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const restartCountdown = useCallback(() => {
    resetCountdown();
    setCountdown(initialTime);
    setIsActive(true);
  }, [initialTime, resetCountdown]);

  useEffect(() => {
    if (!isActive) return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  return {
    countdown,
    isActive,
    startCountdown,
    resetCountdown,
    restartCountdown,
  };
};
