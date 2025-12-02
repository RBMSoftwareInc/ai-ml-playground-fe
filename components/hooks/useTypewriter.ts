'use client';

import { useState, useEffect } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number; // milliseconds per character
  delay?: number; // delay before starting
  onComplete?: () => void;
}

export function useTypewriter({ text, speed = 50, delay = 0, onComplete }: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (text.length === 0) return;

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const startDelay = setTimeout(() => {
      const typeNextChar = () => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          timeoutId = setTimeout(typeNextChar, speed);
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      };

      typeNextChar();
    }, delay);

    return () => {
      clearTimeout(startDelay);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text, speed, delay, onComplete]);

  return { displayedText, isComplete };
}

