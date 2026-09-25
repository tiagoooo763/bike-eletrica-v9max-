import React, { useState, useEffect } from 'react';
import { formatCountdown } from '../../utils/formatters';

interface CountdownProps {
  targetTimestamp: number;
  onExpire?: () => void;
  className?: string;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetTimestamp,
  onExpire,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => Math.max(0, targetTimestamp - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, targetTimestamp - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp, onExpire]);

  const { hours, minutes, seconds } = formatCountdown(timeLeft);

  return (
    <div className={`inline-flex items-center gap-1 font-mono font-bold text-xs ${className}`}>
      <span className="bg-slate-900/90 text-white px-1.5 py-0.5 rounded shadow-sm">
        {hours}
      </span>
      <span className="text-white font-bold">:</span>
      <span className="bg-slate-900/90 text-white px-1.5 py-0.5 rounded shadow-sm">
        {minutes}
      </span>
      <span className="text-white font-bold">:</span>
      <span className="bg-slate-900/90 text-white px-1.5 py-0.5 rounded shadow-sm">
        {seconds}
      </span>
    </div>
  );
};
