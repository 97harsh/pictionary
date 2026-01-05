import { useState, useCallback } from 'react';

export function useTapHighlight() {
  const [isPressed, setIsPressed] = useState(false);

  const handlers = {
    onTouchStart: useCallback(() => setIsPressed(true), []),
    onTouchEnd: useCallback(() => setIsPressed(false), []),
    onTouchCancel: useCallback(() => setIsPressed(false), []),
    onMouseDown: useCallback(() => setIsPressed(true), []),
    onMouseUp: useCallback(() => setIsPressed(false), []),
    onMouseLeave: useCallback(() => setIsPressed(false), []),
  };

  return { isPressed, handlers };
}
