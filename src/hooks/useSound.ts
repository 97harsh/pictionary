"use client";

import { useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';

interface UseSoundOptions {
  volume?: number;
  loop?: boolean;
}

export function useSound(url: string, { volume = 0, loop = false }: UseSoundOptions = {}) {
  const playerRef = useRef<Tone.Player | null>(null);
  const loadedRef = useRef<boolean>(false);

  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window === 'undefined') return;

    const player = new Tone.Player({
      url,
      loop,
      onload: () => {
        loadedRef.current = true;
        // console.log(`Sound loaded: ${url}`);
      },
      onerror: (err) => {
        loadedRef.current = false;
        console.warn(`Sound file not found (optional): ${url}`);
      }
    }).toDestination();
    player.volume.value = volume;
    playerRef.current = player;

    return () => {
      // Safely dispose player
      try {
        if (player.state === 'started') {
          player.stop();
        }
        player.dispose();
      } catch (e) {
        // Silently handle disposal errors
      }
    };
  }, [url, volume, loop]);

  const play = useCallback(async () => {
    // Ensure this runs only in the browser
    if (typeof window === 'undefined') return;

    // Skip if sound file wasn't loaded
    if (!loadedRef.current || !playerRef.current) return;

    try {
      await Tone.start();
      if (playerRef.current?.state !== 'started') {
          playerRef.current?.start();
      }
    } catch (e) {
      // Silently fail if sound can't play
    }
  }, []);

  const stop = useCallback(() => {
    // Ensure this runs only in the browser
    if (typeof window === 'undefined') return;
    
    if (playerRef.current?.state === 'started') {
      playerRef.current?.stop();
    }
  }, []);

  return { play, stop };
}
