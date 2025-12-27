
"use client";

import React, { useEffect, useCallback } from 'react';

const Confetti: React.FC = () => {
  useEffect(() => {
    const fire = async () => {
      const canvasConfetti = await import('canvas-confetti');
      const confetti = canvasConfetti.default;
      
      const options: canvasConfetti.Options = {
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      };
      
      confetti(options);
    };

    fire();
  }, []);

  return null;
};

export default Confetti;
