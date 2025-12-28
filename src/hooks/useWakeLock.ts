import { useEffect, useRef } from 'react';

/**
 * Hook to prevent screen from dimming or sleeping during gameplay
 * Uses the Screen Wake Lock API when available
 */
export function useWakeLock(enabled: boolean = true) {
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) return;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          console.log('Wake Lock activated');
        }
      } catch (err) {
        console.log('Wake Lock failed:', err);
      }
    };

    // Request wake lock
    requestWakeLock();

    // Re-request wake lock if page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && wakeLockRef.current?.released) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      wakeLockRef.current?.release().then(() => {
        console.log('Wake Lock released');
      });
    };
  }, [enabled]);
}
