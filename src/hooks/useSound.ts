"use client";

import { useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';

interface UseSoundOptions {
  volume?: number;
  loop?: boolean;
}

export function useSound(url: string, { volume = 0, loop = false }: UseSoundOptions = {}) {
  const playerRef = useRef<Tone.Player | null>(null);

  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window === 'undefined') return;

    const player = new Tone.Player({
      url,
      loop,
      onload: () => {
        // console.log(`Sound loaded: ${url}`);
      },
      onerror: (err) => {
        console.error(`Error loading sound: ${url}`, err);
      }
    }).toDestination();
    player.volume.value = volume;
    playerRef.current = player;

    return () => {
      player?.dispose();
    };
  }, [url, volume, loop]);

  const play = useCallback(async () => {
    // Ensure this runs only in the browser
    if (typeof window === 'undefined') return;

    try {
      await Tone.start();
      if (playerRef.current?.state !== 'started') {
          playerRef.current?.start();
      }
    } catch (e) {
      console.error("Error starting Tone.js", e);
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
