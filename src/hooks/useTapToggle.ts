import { useState, useCallback } from 'react';

export function useTapToggle(initialState = false) {
  const [isActive, setIsActive] = useState(initialState);

  const toggle = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  const activate = useCallback(() => {
    setIsActive(true);
  }, []);

  const deactivate = useCallback(() => {
    setIsActive(false);
  }, []);

  return { isActive, toggle, activate, deactivate };
}
