'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { float } from "./SizedBox";
import useLocalStorage from "../static/save";
import { UseFirebase } from "./firebase_hooks";
import { doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../static/firebase";
import { toast } from "react-toastify";
import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence } from "firebase/auth";


type WatchContextType = {
    currentPageIndex: number;
    setCurrentPageIndex: (index: number) => void;
    taskCount: number;
    setCount: (count: number) => void;
    taskLength: number;
    setTaskLength: (length: number) => void;
    FlexStart: (item: React.ReactNode) => React.ReactNode;
    minutes:float;
    seconds:float;
    hour:float;
    setMinutes: (val:number) => void;
    setHour: (val:number) => void;
    setSeconds: (val:number) => void;
    isToolBarShown:boolean;
    setToolBarShown:(val:boolean) => void;
    isOverlayShown: boolean,
    showOverlay:(val:boolean) => void;
    description:string;
    setDescription:(val:any) => void;
    tasks:Record<any,any>;
    setTask:(val:Record<any,any>) => void;
    completedTask:Record<any,any>;
    setCompletedTask:(val:any) => void;
    timer:Record<any,any>;
    setTimer:(val:any) => void;
    toggleSignUp:(val:any) => void;
    IsSignUpVisible:boolean;
    ActivePageIndex: number;
    setActivePageIndex: (val:number) => void;
    userId:string | null
    setCurrentUserId:(val:string | null) => void;
    currentTime:string;
    setTime:(val:string) => void;
    isAuthReady:boolean;
    isAsking:boolean;
    setIsAsking:(val:boolean) => void;
    open:boolean;
    setOpen:(val:boolean) => void;
    snackText:string;
    setSnackText:(val:string) => void;
    snackSeverity:any;
    setSnackSeverity:any;
};

const WatchContext = createContext<WatchContextType | undefined>(undefined);

export const WatchProvider = ({ children }: { children: ReactNode }) => {
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
    const [taskCount, setCount] = useState<number>(0);
    const [taskLength, setTaskLength] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);
    const [hour, setHour] = useState<number>(0);
    const [isToolBarShown, setToolBarShown] = useState<boolean>(false);
    const [isOverlayShown, showOverlay] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [IsSignUpVisible,toggleSignUp] = useState<boolean>(false);
    const [ActivePageIndex, setActivePageIndex] = useState<number>(0);
    const [userId,setCurrentUserId] = useState<string | null>(null);
    const [currentTime, setTime] = useState<string>('00:00');
    const [timers, setTimers] = useState<Record<string, { time: string; description?: string }>>({});
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isAsking, setIsAsking] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [snackText, setSnackText] = useState<string>('');
    const [snackSeverity, setSnackSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('info');

    useEffect(() => {
   setPersistence(auth, browserLocalPersistence)
    .then(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUserId(user.uid);
        } else {
          setCurrentUserId(null);
        }
        setIsAuthReady(true); // <- Add this line
      });

      return () => unsubscribe();
    })
    .catch((e: any) => toast.warning('Error ' + e.message));
    }, []);


    const [tasks,setTask] = useState<Record<number,any>>({});
    const [completedTask,setCompletedTask] = useState<Record<number,any>>({});
    const [timer, setTimer] = useState<any>({});


   
    
    // Add similar save effects for other states if needed
    function FlexStart(item:React.ReactNode){
        return (
            <div className="flex flex-start w-full p-1">{item}</div>
        );
    }


    return (
        <WatchContext.Provider
            value={{
                currentPageIndex,
                setCurrentPageIndex,
                taskCount,
                setCount,
                taskLength,
                setTaskLength,
                FlexStart,
                seconds,
                minutes,
                hour,
                setHour,
                setMinutes,
                setSeconds,
                isToolBarShown,
                setToolBarShown,
                showOverlay,
                isOverlayShown,
                setDescription,
                description,
                tasks,
                setCompletedTask,
                completedTask,
                setTask,
                timer,
                setTimer,
                IsSignUpVisible,
                toggleSignUp,
                ActivePageIndex,
                setActivePageIndex,
                userId,
                setCurrentUserId,
                currentTime,
                setTime,
                isAuthReady,
                isAsking,
                setIsAsking,
                open,
                setOpen,
                snackText,
                setSnackText,
                snackSeverity,
                setSnackSeverity
            }}
        >
            {children}
        </WatchContext.Provider>
    );
};

export const useWatch = (): WatchContextType => {
    const context = useContext(WatchContext);
    if (!context) {
        throw new Error("useWatch must be used within a WatchProvider");
    }
    return context;
};

