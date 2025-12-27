"use client";

import React, { useEffect, useCallback } from 'react';

const Confetti: React.FC = () => {
  const fire = useCallback(async () => {
    const { default: confetti, type Options } = await import('canvas-confetti');
    
    const options: Options = {
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    };
    
    confetti(options);
  }, []);

  useEffect(() => {
    fire();
  }, [fire]);

  return null;
};

export default Confetti;
