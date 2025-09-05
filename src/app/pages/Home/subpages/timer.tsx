'use client'
import React, { useEffect, useState } from "react";
import ListTile from "@/app/components/ListTile";
import PageCount from "@/app/components/page_count";
import { useWatch } from "@/app/hooks/page_index";
import SizedBox from "@/app/hooks/SizedBox";
import { faBarsProgress, faVolumeHigh, faEllipsisVertical, faClock, faHourglass, faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress, Fab, TextField } from "@mui/material";
import ToolBar from "@/app/components/toolkit";
import { ThemeColor } from "@/app/static/colors";
import { onSnapshot, doc, getDoc, setDoc, updateDoc, deleteField } from "@firebase/firestore";
import { db } from "@/app/static/firebase";
import { CountdownTimer } from "@/app/components/circle_timer";
import { UseFirebase } from "@/app/hooks/firebase_hooks";
import { toast } from "react-toastify";


const TimerPage: React.FC = () => {
  const {setIsTimeUp,darkMode, setToolBarShown, showOverlay, setCurrentPageIndex, description, setDescription, userId,setTimer,isAsking,setIsAsking, setSnackSeverity,setSnackText,setOpen } = useWatch();

  const [timers, setTimers] = useState<Record<string, { time: string; description?: string; startTimestamp?: number }>>({});
  const [currentTimerIndex, setCurrentTimerIndex] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [confirmDelete, setConfirmation] = useState<boolean>(false);
  const [newKey, setNewKey] = useState<number>(0);
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

    return () => {
      unsubscribe()

    };
  }, [userId]);

  //Show pop up on request
  useEffect(() => {
        if(isAsking){
            setTimeout(() => {
            showOverlay(true);
            setToolBarShown(true);
            setIsAsking(false);
            },500);
        }
    },[])

  const timerKeys = Object.keys(timers).reverse();
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
              <FontAwesomeIcon icon={faBarsProgress} opacity={0.6} color={darkMode ? 'white':''} />
              <FontAwesomeIcon icon={faVolumeHigh} opacity={0.6} color={darkMode ? 'white':''}/>
              <FontAwesomeIcon icon={faEllipsisVertical} opacity={0.6} color={darkMode ? 'white':''} />
            </div>
          }
        />
        <SizedBox height={20} />

        <div className="flex gap-4 mb-2">
          <Button onClick={goPrev} disabled={timerKeys.length <= 1} sx={{
            backgroundColor: darkMode ? 'grey':''
          }}>
            Prev
          </Button>
          <Button onClick={goNext} disabled={timerKeys.length <= 1} sx={{
            backgroundColor: darkMode ? 'grey':''
          }}>
            Next
          </Button>
        </div>

        {currentTimerData && (
  <>
    {(currentTimerData.startTimestamp && parsedTime.minutes > 0) ? (
      <CountdownTimer
        key={currentKey}
        hours={parsedTime.hours}
        minutes={parsedTime.minutes}
        seconds={parsedTime.seconds}
        strokeWidth={10}
        colors={["#5F29CC", "#5F29CC", "#5F29CC"]}
        size={200}
        startTimestamp={currentTimerData?.startTimestamp}
        onComplete={() => {
          // setOpen(true);
          // setSnackText(`Timer ${currentKey} completed`);
          // setSnackSeverity('success');
          setIsTimeUp(true);
        }}
      />
    ) : (
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-[10pt] opacity-70" style={{
          color:darkMode ? 'white':''
        }}>Ready to start: {currentTimerData.time}</h3>
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


        <p style={{
          color: darkMode ? 'white':''
        }}>{currentTimerData?.description ?? description}</p>
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
            setOpen(true);
            setSnackText('Success');
            setSnackSeverity('success');
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
           onClick={()=> {
              setConfirmation(true);
             
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
          {confirmDelete && (<div className="h-auto w-96 flex justify-center items-center fixed pop-up">
            <form style={{ whiteSpace: 'pre-line' }}
            onSubmit={async(e) => {
              e.preventDefault();
              if(!userId) return;
              const dataRef = doc(db,'timer',userId);
              await updateDoc(dataRef,{
              [`${newKey}`]:deleteField()
              }).then(() => {
              setOpen(true);
              setSnackText('Timer deleted');
              setSnackSeverity('success');
              setTimer((prev:any) => {
                const updated = {...prev};
                delete updated[newKey];
                return updated;
              })
              });
              setConfirmation(false);
            }}
             className="flex justify-center items-center w-full h-auto p-4 bg-white rounded-2xl flex-col max-h-96 overflow-auto">
            {Object.entries(timers).map(([key, value]) => (
            <p key={key}>
              {key}: {value.description ?? "No description"}
          </p>
          ))}
            <SizedBox height={10}/>
            <input type="number" placeholder="Enter the key to delete" className="rounded shadow w-52 p-1"
            onChange={(val) => setNewKey(parseInt(val.target.value))}
            required></input>
            <SizedBox height={10}/>
            <Button 
             type={'submit'}
             variant={'contained'}>Confirm</Button>
            
          </form>
          </div>)}
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
                      {/* Editable hour input */}
                      <input
                        type="number"
                        min={0}
                        max={23}
                        value={currentTime.split(":")[0] || "00"}
                        onChange={(e) => {
                          let hour = e.target.value;
                          if (hour.length < 2) hour = hour.padStart(1, "0");
                          const minute = currentTime.split(":")[1] || "00";
                          setCurrentTime(`${hour}:${minute}`);
                        }}
                        placeholder="HH"
                        className="w-16 h-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span>:</span>
                      {/* Editable minute input */}
                      <input
                        type="number"
                        min={0}
                        max={59}
                        value={currentTime.split(":")[1] || "00"}
                        onChange={(e) => {
                          let minute = e.target.value;
                          if (minute.length < 2) minute = minute.padStart(1, "0");
                          const hour = currentTime.split(":")[0] || "00";
                          setCurrentTime(`${hour}:${minute}`);
                        }}
                        placeholder="MM"
                        className="w-16 h-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {/* Native time picker */}
                      <input
                        type="time"
                        value={currentTime || "00:00"}
                        onChange={(e) => setCurrentTime(e.target.value)}
                        className="w-24 h-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ marginLeft: "10px" }}
                      />
                    </div>
                    
                  <p className="text-[10pt]">Enter the description</p>
                  <TextField
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Same as the target task"
                    label="Description"
                    className="w-full h-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    slotProps={{
                      input:{
                        startAdornment:(
                          <FontAwesomeIcon icon={faTasks} style={{ marginRight: 8, color: 'gray' }} />
                        )
                      }
                    }}
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


