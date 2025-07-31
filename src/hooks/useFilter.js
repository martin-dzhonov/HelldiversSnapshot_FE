import { useState, useEffect } from 'react';

export default function useFilter(initialValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(initialValue.page);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(initialValue.page, JSON.stringify(state));
    } catch {}
  }, [initialValue.page, state]);

  return [state, setState];
}