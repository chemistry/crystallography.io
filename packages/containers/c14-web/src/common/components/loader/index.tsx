import type { MutableRefObject } from 'react';
import { useState, useCallback, useRef, useLayoutEffect } from 'react';
import { LoaderIcon } from './loader-icon';

export const Loader: React.FC<
  React.PropsWithChildren<{ isVisible: boolean; scrollElement: MutableRefObject<any> }>
> = ({ isVisible, scrollElement, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState('50%');

  const handler = useCallback(() => {
    const container = containerRef.current;
    const parentEl = scrollElement.current;

    if (parentEl && container && container.clientHeight > 0) {
      const parentOffsetTop = container.offsetTop;
      const parentHeight = container.clientHeight;
      const h = parentEl.clientHeight;
      const scrollTop = parentEl.scrollTop;
      const h1 = Math.max(parentOffsetTop - scrollTop, 0);
      const h2 = Math.min(parentOffsetTop + parentHeight - scrollTop, h);
      const pos = (h1 + h2) / 2 + scrollTop - parentOffsetTop - 5;
      const mTop = parseInt(top, 10);
      if (mTop && Math.abs(mTop - pos) > 2) {
        setTop(`${pos}px`);
      }
    } else {
      setTop('50%');
    }
  }, []);

  useLayoutEffect(() => {
    const parentEl = scrollElement.current;
    if (parentEl) {
      window.addEventListener('resize', handler);
      parentEl.addEventListener('scroll', handler);
      setTimeout(handler, 0);
      return () => {
        window.removeEventListener('resize', handler);
        parentEl.removeEventListener('scroll', handler);
      };
    }
  });

  if (isVisible) {
    return (
      <div className="c-loader-container" ref={containerRef}>
        <div className="c-loader-wrap">
          <div className="c-loader-img" style={{ top }}>
            <LoaderIcon />
          </div>
        </div>
        {children}
      </div>
    );
  }
  return (
    <div className="c-loader-container" ref={containerRef}>
      {children}
    </div>
  );
};
