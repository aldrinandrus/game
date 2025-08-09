import { useRef, useCallback, useEffect } from 'react';

interface UseAnimationFrameReturn {
  start: () => void;
  stop: () => void;
  isRunning: boolean;
}

export const useAnimationFrame = (
  callback: (timestamp: number) => void,
  isActive: boolean = true
): UseAnimationFrameReturn => {
  const animationRef = useRef<number>();
  const isRunningRef = useRef(false);

  const start = useCallback(() => {
    if (isRunningRef.current) {
      console.warn('Animation frame already running, stopping previous one');
      stop();
    }
    
    isRunningRef.current = true;
    
    const animate = (timestamp: number) => {
      if (!isRunningRef.current) return;
      
      try {
        callback(timestamp);
      } catch (error) {
        console.error('Error in animation frame:', error);
        stop();
        return;
      }
      
      if (isRunningRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [callback]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  }, []);

  // Auto-start/stop based on isActive prop
  useEffect(() => {
    if (isActive) {
      start();
    } else {
      stop();
    }
  }, [isActive, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    start,
    stop,
    isRunning: isRunningRef.current
  };
}; 