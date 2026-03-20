import { useEffect, useRef } from "react";

export function useResizeObserver(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      callbackRef.current();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);
}
