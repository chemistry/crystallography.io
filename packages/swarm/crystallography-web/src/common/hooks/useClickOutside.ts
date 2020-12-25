import { MutableRefObject, useEffect, useRef } from 'react';

export const useClickOutside = (ref: MutableRefObject<any>, callback: ()=> void) => {

    const handleClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
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
