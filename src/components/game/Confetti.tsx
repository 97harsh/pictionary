
"use client";

import React, { useEffect } from 'react';

const Confetti: React.FC = () => {
  useEffect(() => {
    const fire = (particleRatio: number, opts: any) => {
      const confetti = (window as any).confetti;
      if (confetti) {
        confetti(
          Object.assign({}, { origin: { y: 0.7 } }, opts, {
            particleCount: Math.floor(200 * particleRatio),
          })
        );
      }
    };
    
    const loadConfetti = async () => {
        if (!(window as any).confetti) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
            script.async = true;
            document.body.appendChild(script);
            script.onload = () => {
                fire(0.25, {
                    spread: 26,
                    startVelocity: 55,
                });
                fire(0.2, {
                    spread: 60,
                });
                fire(0.35, {
                    spread: 100,
                    decay: 0.91,
                    scalar: 0.8,
                });
                fire(0.1, {
                    spread: 120,
                    startVelocity: 25,
                    decay: 0.92,
                    scalar: 1.2,
                });
                fire(0.1, {
                    spread: 120,
                    startVelocity: 45,
                });
            }
        } else {
             fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });
            fire(0.2, {
                spread: 60,
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8,
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2,
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }
    };

    loadConfetti();

  }, []);

  return null;
};

export default Confetti;
