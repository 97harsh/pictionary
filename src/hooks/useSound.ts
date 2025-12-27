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
      player.dispose();
    };
  }, [url, volume, loop]);

  const play = useCallback(async () => {
    await Tone.start();
    if (playerRef.current?.state !== 'started') {
        playerRef.current?.start();
    }
  }, []);

  const stop = useCallback(() => {
    if (playerRef.current?.state === 'started') {
      playerRef.current?.stop();
    }
  }, []);

  return { play, stop };
}
