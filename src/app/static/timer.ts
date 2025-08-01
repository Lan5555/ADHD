import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import { float } from "../hooks/SizedBox";

type TimerHookParams = {
  seconds?: float;
  minutes?: float;
  hours?: float;
  storageKey?: string;
};

export function Timer({
  seconds = 0,
  minutes = 0,
  hours = 0,
  storageKey = "persistent-timer",
}: TimerHookParams) {
  const calculateExpiry = (): Date => {
    const saved = localStorage.getItem(storageKey);
    const expiry = new Date();

    if (saved) {
      return new Date(saved);
    } else {
      expiry.setSeconds(expiry.getSeconds() + seconds);
      expiry.setMinutes(expiry.getMinutes() + minutes);
      expiry.setHours(expiry.getHours() + hours);
      localStorage.setItem(storageKey, expiry.toISOString());
      return expiry;
    }
  };

  const [expiryTimestamp, setExpiryTimestamp] = useState<Date>(calculateExpiry);

  const {
    seconds: currentSeconds,
    minutes: currentMinutes,
    hours: currentHours,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    autoStart: true,
    onExpire: () => {
      localStorage.removeItem(storageKey);
    },
  });

  // // Update timer if localStorage is modified elsewhere
  // useEffect(() => {
  //   const handleStorage = (event: StorageEvent) => {
  //     if (event.key === storageKey && event.newValue) {
  //       const newExpiry = new Date(event.newValue);
  //       if (newExpiry.getTime() !== expiryTimestamp.getTime()) {
  //         restart(newExpiry, true);
  //         setExpiryTimestamp(newExpiry);
  //       }
  //     }
  //   };

  //   window.addEventListener("storage", handleStorage);
  //   return () => window.removeEventListener("storage", handleStorage);
  // }, [expiryTimestamp, restart, storageKey]);

  // // Optional: clear on unload if expired
  // useEffect(() => {
  //   const handleUnload = () => {
  //     if (new Date() > expiryTimestamp) {
  //       localStorage.removeItem(storageKey);
  //     }
  //   };
  //   window.addEventListener("beforeunload", handleUnload);
  //   return () => window.removeEventListener("beforeunload", handleUnload);
  // }, [expiryTimestamp, storageKey]);

  return {
    currentSeconds,
    currentMinutes,
    currentHours,
    isRunning,
    start,
    pause,
    resume,
    restart,
  };
}


export function parseTimerString(timer: string) {
  if (!timer || typeof timer !== "string") {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const parts = timer.split(':').map(part => {
    const num = Number(part.trim());
    return isNaN(num) ? 0 : num;
  });

  if (parts.length === 3) {
    return { hours: parts[0], minutes: parts[1], seconds: parts[2] };
  } else if (parts.length === 2) {
    return { hours: 0, minutes: parts[0], seconds: parts[1] };
  } else if (parts.length === 1) {
    return { hours: 0, minutes: 0, seconds: parts[0] };
  }

  return { hours: 0, minutes: 0, seconds: 0 };
}
