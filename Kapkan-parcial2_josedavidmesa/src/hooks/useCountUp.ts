import { useEffect, useRef, useState } from 'react';

// Anima un número desde su valor anterior hasta "value"
export default function useCountUp(value: number, duration = 900) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = performance.now();
    const initial = from.current;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(initial + (value - initial) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      from.current = value;
    };
  }, [value, duration]);

  return display;
}
