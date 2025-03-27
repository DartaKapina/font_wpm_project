import { useState, useEffect, useRef } from "react";

interface TimerProps {
  duration: number; // Duration in seconds
  isRunning: boolean;
  startTime?: number; // Optional timestamp to sync with
  onComplete: (remainingTime: number) => void;
}

const Timer: React.FC<TimerProps> = ({
  duration,
  isRunning,
  startTime,
  onComplete,
}: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const intervalRef = useRef<number | null>(null);

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!isRunning && startTime) {
      // Calculate remaining time when stopping
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      onComplete(remaining);
      stopTimer();
      return;
    }

    if (!isRunning || !startTime) {
      setTimeLeft(duration);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onComplete(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, startTime, duration, onComplete]);

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
