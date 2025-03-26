import { useState, useEffect, useRef } from "react";

interface TimerProps {
  duration: number; // Duration in seconds
  onComplete: () => void;
  startTime?: number; // Optional timestamp to sync with
  isRunning?: boolean;
}

const Timer = ({
  duration,
  onComplete,
  startTime,
  isRunning = false,
}: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef<number | null>(null);

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isRunning && startTime) {
      // Initial sync
      const syncTimer = () => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(duration - elapsed, 0);
        setTimeLeft(remaining);

        if (remaining <= 0) {
          stopTimer();
          onComplete();
        }
      };

      // Sync once immediately
      syncTimer();

      // Then set up the interval
      intervalRef.current = setInterval(syncTimer, 1000);

      return () => {
        stopTimer();
      };
    } else {
      stopTimer();
      setTimeLeft(duration);
    }
  }, [duration, startTime, isRunning, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: "2rem",
        fontWeight: "bold",
        color: "#334155",
        padding: "0.75rem 1.5rem",
        backgroundColor: "#f1f5f9",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 100,
        border: "2px solid #cbd5e1",
      }}
    >
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
};

export default Timer;
