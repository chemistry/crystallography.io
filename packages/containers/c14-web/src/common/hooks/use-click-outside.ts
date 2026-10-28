import { useEffect } from 'react';
import type { MutableRefObject } from 'react';

export const useClickOutside = (
  ref: MutableRefObject<HTMLElement | null>,
  callback: () => void
) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node | null)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};
