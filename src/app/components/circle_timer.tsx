'use client';

import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

type CountdownTimerProps = {
  hours?: number;
  minutes?: number;
  seconds?: number;
  size?: number;
  strokeWidth?: number;
  colors?: [`#${string}`, `#${string}`, `#${string}`]; // Strict format
  onComplete?: () => void;
  startTimestamp?: number; // UNIX timestamp in milliseconds when timer started
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  hours = 0,
  minutes = 0,
  seconds = 0,
  size = 150,
  strokeWidth = 15,
  colors = ['#4caf50', '#F7B801', '#A30000'],
  onComplete,
  startTimestamp,
}) => {
  const totalDuration = hours * 3600 + minutes * 60 + seconds;

  // Calculate remaining time based on startTimestamp and current time
  const now = Math.floor(Date.now() / 1000);
  const initialRemainingTime = startTimestamp
    ? Math.max(totalDuration - (now - Math.floor(startTimestamp / 1000)), 0)
    : totalDuration;

  return (
    <CountdownCircleTimer
      isPlaying={initialRemainingTime > 0}
      duration={totalDuration}
      initialRemainingTime={initialRemainingTime}
      colors={colors}
      colorsTime={[totalDuration, totalDuration / 2, totalDuration / 4]}
      strokeWidth={strokeWidth}
      size={size}
      onComplete={() => {
        onComplete?.();
        return { shouldRepeat: false };
      }}
    >
      {({ remainingTime }: { remainingTime: number }) => {
        const h = Math.floor(remainingTime / 3600);
        const m = Math.floor((remainingTime % 3600) / 60);
        const s = remainingTime % 60;

        return (
          <div style={{ fontSize: size / 7, fontWeight: 'bold' }}>
            {String(h).padStart(2, '0')}:
            {String(m).padStart(2, '0')}:
            {String(s).padStart(2, '0')}
          </div>
        );
      }}
    </CountdownCircleTimer>
  );
};
