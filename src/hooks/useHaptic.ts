/**
 * Hook to provide haptic feedback on supported devices
 */
export function useHaptic() {
  const vibrate = (pattern: number | number[] = 50) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return {
    // Light tap feedback
    tap: () => vibrate(50),
    // Success feedback
    success: () => vibrate([50, 50, 50]),
    // Warning/error feedback
    warning: () => vibrate([100, 50, 100]),
    // Custom vibration pattern
    custom: vibrate
  };
}
