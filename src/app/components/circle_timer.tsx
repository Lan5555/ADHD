import React, { useMemo } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useWatch } from '../hooks/page_index';

type CountdownTimerProps = {
  hours?: number;
  minutes?: number;
  seconds?: number;
  size?: number;
  strokeWidth?: number;
  colors?: [`#${string}`, `#${string}`, `#${string}`];
  onComplete?: () => void;
  startTimestamp?: number; // in ms
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
  const {darkMode} = useWatch();
  const totalDuration = useMemo(() => {
    return hours * 3600 + minutes * 60 + seconds;
  }, [hours, minutes, seconds]);

  const initialRemainingTime = useMemo(() => {
    if (!startTimestamp) return totalDuration;
    const now = Math.floor(Date.now() / 1000);
    const start = Math.floor(startTimestamp / 1000);
    return Math.max(totalDuration - (now - start), 0);
  }, [startTimestamp, totalDuration]);

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
          <div style={{ fontSize: size / 7, fontWeight: 'bold',color:darkMode ? 'white':'' }}>
            {String(h).padStart(2, '0')}:
            {String(m).padStart(2, '0')}:
            {String(s).padStart(2, '0')}
          </div>
        );
      }}
    </CountdownCircleTimer>
  );
};
