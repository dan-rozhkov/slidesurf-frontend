
import { atom, useAtom } from "jotai";
import { useEffect, useState, useCallback } from "react";

export const zoomAtom = atom<number>(
  Number(import.meta.env.VITE_DEFAULT_ZOOM) || 100
);

export const useZoomAtom = (): [number, (value: number) => void] => {
  const [zoom, setZoom] = useAtom(zoomAtom);

  return [zoom, setZoom];
};

export const useZoom = (containerRef: React.RefObject<HTMLElement>) => {
  const [zoom, setZoom] = useZoomAtom();
  const [fontSize, setFontSize] = useState(16);
  const calculateFontSize = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const calculatedSize = (containerWidth / 60) * (zoom / 100);
      setFontSize(calculatedSize);
    }
  }, [containerRef, zoom]);

  useEffect(() => {
    calculateFontSize();
    window.addEventListener("resize", calculateFontSize);

    return () => window.removeEventListener("resize", calculateFontSize);
  }, [zoom, containerRef, calculateFontSize]);

  return { zoom, setZoom, fontSize, calculateFontSize };
};
