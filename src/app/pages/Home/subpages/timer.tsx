import React, { useEffect, useState } from "react";
import ListTile from "@/app/components/ListTile";
import PageCount from "@/app/components/page_count";
import { useWatch } from "@/app/hooks/page_index";
import SizedBox from "@/app/hooks/SizedBox";
import { faBarsProgress, faVolumeHigh, faEllipsisVertical, faClock, faHourglass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress, Fab } from "@mui/material";
import ToolBar from "@/app/components/toolkit";
import { ThemeColor } from "@/app/static/colors";
import { onSnapshot, doc, getDoc, setDoc, updateDoc, deleteField } from "@firebase/firestore";
import { db } from "@/app/static/firebase";
import { CountdownTimer } from "@/app/components/circle_timer";
import { UseFirebase } from "@/app/hooks/firebase_hooks";
import { toast } from "react-toastify";

const TimerPage: React.FC = () => {
  const { setToolBarShown, showOverlay, setCurrentPageIndex, description, setDescription, userId,setTimer } = useWatch();

  const [timers, setTimers] = useState<Record<string, { time: string; description?: string; startTimestamp?: number }>>({});
  const [currentTimerIndex, setCurrentTimerIndex] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
 

  // Load timers and listen for realtime updates
  useEffect(() => {
    if (!userId) return;

    const timerDocRef = doc(db, "timer", userId);

    const unsubscribe = onSnapshot(timerDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as Record<string, any>;
        setTimers(data);
        setLoading(false);
      } else {
        setTimers({});
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const timerKeys = Object.keys(timers);
  const currentKey = timerKeys[currentTimerIndex];
  const currentTimerData = currentKey ? timers[currentKey] : null;

  // Parse time string "HH:MM" (default seconds to 0)
  const parsedTime = currentTimerData
    ? {
        hours: Number(currentTimerData.time.split(":")[0]) || 0,
        minutes: Number(currentTimerData.time.split(":")[1]) || 0,
        seconds: 0,
      }
    : { hours: 0, minutes: 0, seconds: 0 };

  // Total seconds for this timer
  const totalSeconds = (parsedTime.hours * 3600) + (parsedTime.minutes * 60);

  // Calculate elapsed time from startTimestamp
  const startTimestamp = currentTimerData?.startTimestamp || 0;
  const elapsedSeconds = startTimestamp ? Math.floor((Date.now() - startTimestamp) / 1000) : 0;

  // Calculate remaining seconds
  const remainingSeconds = Math.max(totalSeconds - elapsedSeconds, 0);

  // Convert remaining seconds to h/m/s
  const remHours = Math.floor(remainingSeconds / 3600);
  const remMinutes = Math.floor((remainingSeconds % 3600) / 60);
  const remSeconds = remainingSeconds % 60;

  const goNext = () => setCurrentTimerIndex((i) => (i + 1) % timerKeys.length);
  const goPrev = () => setCurrentTimerIndex((i) => (i - 1 + timerKeys.length) % timerKeys.length);

  async function byPass() {
    setCurrentPageIndex(1);
    setTimeout(() => {
      setCurrentPageIndex(2);
      showOverlay(false);
    }, 500);
  }

  const startTimer = async () => {
    if (!userId || !currentKey) return;

    const docRef = doc(db, "timer", userId);
    await setDoc(docRef, {
      [currentKey]: {
        ...timers[currentKey],
        startTimestamp: Date.now(),
      },
    }, { merge: true });
    
  };

  const handleToolkitClick = async (index: number): Promise<void> => {
    switch (index) {
      case 0:
        setLoading(true);
        setTimeout(async () => {
          setLoading(false);
          setToolBarShown(false);
          await byPass();

          if (!userId) return;

          try {
            const docRef = doc(db, "timer", userId);
            const docSnap = await getDoc(docRef);

            let newKey = "0";
            let existingTimers: Record<string, any> = {};

            if (docSnap.exists()) {
              existingTimers = docSnap.data() as Record<string, any>;
              const keys = Object.keys(existingTimers).map(Number);
              const maxKey = keys.length > 0 ? Math.max(...keys) : -1;
              newKey = String(maxKey + 1);
            }

            const newTimer = {
              [newKey]: {
                time: currentTime || "00:01",
                description: description || "No description",
              },
            };

            await setDoc(docRef, newTimer, { merge: true });

            console.log("Timer added with key", newKey);
          } catch (e: any) {
            console.error("Error adding new timer:", e);
          }
        }, 2000);
        break;

      case 1:
        setToolBarShown(false);
        showOverlay(false);
        break;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3">
        <ListTile
          leading={null}
          title={"Timer name. click to edit"}
          titleStyle={{ fontSize: "10pt" }}
          type="trail"
          trailing={
            <div className="flex justify-center items-center gap-2">
              <FontAwesomeIcon icon={faBarsProgress} opacity={0.6} />
              <FontAwesomeIcon icon={faVolumeHigh} opacity={0.6} />
              <FontAwesomeIcon icon={faEllipsisVertical} opacity={0.6} />
            </div>
          }
        />
        <SizedBox height={20} />

        <div className="flex gap-4 mb-2">
          <Button onClick={goPrev} disabled={timerKeys.length <= 1}>
            Prev
          </Button>
          <Button onClick={goNext} disabled={timerKeys.length <= 1}>
            Next
          </Button>
        </div>

        {currentTimerData && (
  <>
    {currentTimerData.startTimestamp ? (
      <CountdownTimer
        key={currentKey}
        hours={remHours}
        minutes={remMinutes}
        seconds={0}
        strokeWidth={10}
        colors={["#5F29CC", "#5F29CC", "#5F29CC"]}
        size={250}
        startTimestamp={currentTimerData?.startTimestamp}
        onComplete={() => alert(`Timer ${currentKey} completed`)}
      />
    ) : (
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-sm opacity-70">Ready to start: {currentTimerData.time}</h3>
        <Button variant="contained" sx={{
             mt: 2 ,
             backgroundColor: ThemeColor.primary,
             color:ThemeColor.white
             }} onClick={startTimer} 
        color={'inherit'}>
          Start Timer
        </Button>
      </div>
    )}
  </>
)}


        <p>{currentTimerData?.description ?? description}</p>
        <PageCount currentPage={currentTimerIndex} totalPages={timerKeys.length} />
        <SizedBox height={10} />

        <div className="flex justify-center items-center gap-6">
          <Button
            variant={"contained"}
            sx={{
              color: "white",
              backgroundColor: "lightblue",
              borderRadius: "40px",
              boxShadow: "none",
              padding: "10px 20px",
              width: "100px",
            }}
           onClick={async()=>{
          try{
            if(!userId) return;
            const dataRef = doc(db,'timer',userId);
            await updateDoc(dataRef,{
            [`${currentTimerIndex}.time`]:'00:00'
            }).then(() => {
            toast.success('Timer resetted');
            });

            setTimer((prev: any[]) => ({
            ...prev,
            [currentTimerIndex]: {
            ...prev[currentTimerIndex],
            time: '00:00'
            }
            }));
            }catch(e){}            
           }}>
            Reset
          </Button>
          <Button
            variant={"contained"}
            sx={{
              color: "white",
              backgroundColor: "red",
              borderRadius: "40px",
              boxShadow: "none",
              padding: "10px 20px",
              width: "100px",
            }}
           onClick={async()=> {
              if(!userId) return;
              const dataRef = doc(db,'timer',userId);
              await updateDoc(dataRef,{
              [`${currentTimerIndex}`]:deleteField()
              }).then(() => {
              toast.success('Timer deleted');
              });
           }}>
            Delete
          </Button>
        </div>

        <Fab
          variant="extended"
          color="primary"
          sx={{
            borderRadius: "16px",
            boxShadow: 3,
            textTransform: "none",
            fontWeight: "bold",
            position: "fixed",
            bottom: "90px",
            right: "30px",
            backgroundColor: "blueviolet",
          }}
        >
          <FontAwesomeIcon
            icon={faHourglass}
            style={{
              height: "20px",
              width: "20px",
            }}
            onClick={() => {
              setToolBarShown(true);
              showOverlay(true);
            }}
          />
        </Fab>
        <div className="flex justify-center items-center">
        <ToolBar
          type={"question"}
          content={
            <div>
              {!isLoading ? (
                <div className="flex flex-col justify-center items-center gap-3 relative overflow-y-auto">
                  <FontAwesomeIcon icon={faClock} style={{ height: "30px", color: ThemeColor.primary }} className="animate-spin" />
                  <h2 className="text-[10pt]">
                    Set time to <strong>{currentTime}</strong>
                  </h2>
                  <div className="w-72 rounded p-2 flex justify-center items-center h-10 shadow gap-2">
                    <input type="time" value={currentTime} onChange={(e) => setCurrentTime(e.target.value)} />
                    or
                    <input
                      type="text"
                      value={currentTime}
                      onChange={(e) => setCurrentTime(e.target.value)}
                      placeholder="00hr:00min"
                      className="w-full h-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-[10pt]">Enter the description</p>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Same as the target task"
                    className="w-full h-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <SizedBox height={10} />
                </div>
              ) : (
                <div className="flex justify-center items-center gap-7 flex-col">
                  <h2>Setting time... relax a ☕</h2>
                  <CircularProgress />
                </div>
              )}
            </div>
          }
          onPressed={(index) => handleToolkitClick(index)}
        />
        </div>
      </div>
    </>
  );
};

export default TimerPage;


