import { useState } from "react";
import { useWatch } from "../hooks/page_index";


const useLocalStorage = () => {
    const { setHour, setSeconds, setMinutes } = useWatch();
    const [minutes, setMinutesState] = useState<number>(0);
    const [seconds, setSecondsState] = useState<number>(0);
    const [hour, setHourState] = useState<number>(0);

    const SaveToLocalStorage = (key: string, value: string, type:'time' | 'other') => {
        const seconds = 59;
        const minutes = value.includes(':') ? (parseInt(value.split(':')[1]) - 1) : 0;
        const hours = value.includes(':') ? parseInt(value.split(':')[0]) : 0;
        if (type === 'time') {
            const storageKey = `${key}`;
            let saved = localStorage.getItem(storageKey);
            let expiryTimestamp = new Date();
            expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + seconds);
            expiryTimestamp.setMinutes(expiryTimestamp.getMinutes() + minutes);
            expiryTimestamp.setHours(expiryTimestamp.getHours() + hours);
            localStorage.setItem(storageKey, expiryTimestamp.toISOString());
            setHour(hours);
            setMinutes(minutes);    
            setSeconds(seconds);
            setHourState(hours);
            setMinutesState(minutes);
            setSecondsState(seconds);
        } else {
            localStorage.setItem(key, JSON.stringify(value));   
        }
    }

    const FetchFromLocalStorage = (key: string, type:'time' | 'other') => {
        if (type === 'time') {
            const storageKey = `${key}`;
            let saved = localStorage.getItem(storageKey);
            if (saved) {
                const expiryTimestamp = new Date(saved);
                if (expiryTimestamp) {
                    setMinutesState(expiryTimestamp.getMinutes());
                    setSecondsState(expiryTimestamp.getSeconds()); 
                    setHourState(expiryTimestamp.getHours());
                    return {
                        minutes: expiryTimestamp.getMinutes(),
                        seconds: expiryTimestamp.getSeconds(),
                        hour: expiryTimestamp.getHours()
                    };
                } else {
                    localStorage.removeItem(storageKey);
                    return null;
                }
            }
            return null;
        } else {
            const saved = localStorage.getItem(key);
            if (saved) {
                return JSON.parse(saved);
            }
            return null;
        }
    }

    return {SaveToLocalStorage, FetchFromLocalStorage, minutes, seconds, hour};
}
export default useLocalStorage;