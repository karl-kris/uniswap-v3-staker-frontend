import { useState, useEffect, useRef } from 'react';

export const useIncrementingNumber = (targetNumber: number) => {
  const [currentNumber, setCurrentNumber] = useState(targetNumber);
  const [isAnimating, setIsAnimating] = useState(false);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    setIsAnimating(true);
    const difference = Math.abs(currentNumber - targetNumber);
    const delay = difference > 100 ? 10 : 100;

    const intervalId = setInterval(() => {
      setCurrentNumber((prevNumber) => {
        const step = targetNumber > prevNumber ? 1 : -1;
        const nextNumber = prevNumber + step;
        if (
          (step > 0 && nextNumber >= targetNumber) ||
          (step < 0 && nextNumber <= targetNumber)
        ) {
          clearInterval(intervalId);
          setIsAnimating(false);
          return targetNumber;
        }
        return nextNumber;
      });
    }, delay);

    return () => {
      clearInterval(intervalId);
      setIsAnimating(false);
    };
  }, [currentNumber, targetNumber]);

  return { currentNumber, isAnimating };
};
