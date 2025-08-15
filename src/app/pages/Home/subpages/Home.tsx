'use client'
import ListTile from "@/app/components/ListTile"
import Progress from "@/app/components/loader_div"
import Wrap from "@/app/components/wrap"
import { UseFirebase } from "@/app/hooks/firebase_hooks"
import { useWatch } from "@/app/hooks/page_index"
import SizedBox from "@/app/hooks/SizedBox"
import { ThemeColor, ThemeColorSpecific } from "@/app/static/colors"
import { auth, db } from "@/app/static/firebase"
import { imgIcon } from "@/app/static/styles"
import { faClipboardList, faClock, faRedo, faPause, faPlay, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "@mui/material"
import { onAuthStateChanged } from "firebase/auth"
import { deleteField, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { CSSProperties, useEffect, useState } from "react"
import { toast } from "react-toastify";

const Home:React.FC = () => {
    
    const {setDarkMode,setCurrentPageIndex,
          taskCount, taskLength,
          setCount, setTaskLength,
          FlexStart,tasks,setDescription, timer,setCurrentUserId,userId,setTask, setCompletedTask,setTimer, setOpen, setSnackSeverity, setSnackText,darkMode} = useWatch();
    const colors:string[] = Object.values(ThemeColorSpecific);
    const {fetchDataByQuery,fetchData, addOrUpdateUserData} = UseFirebase();
    const [userName, setUserName] = useState<string>('');
    const [marked, setMarked] = useState<boolean>(false);

  useEffect(() => {
  const fetchData2 = async () => {
    if (!userId) return; // Wait until userId is available

    try {
      const data = await fetchData('tasks', userId);
      if (data) {
        if(data.success){
            setTask({...data.data});
            const Length = Object.keys(data.data).length;
            setTaskLength(Length);
        }
      } else {
        setOpen(true);
      setSnackText('No task found');
      setSnackSeverity('success');
      }
    } catch (e: any) {
      setOpen(true);
      setSnackText('Oops something went wrong');
      setSnackSeverity('warning');
    }
  };

  const fetchUserName = async () => {
    if(!userId) return;
    try{
        const userData = await fetchData('users',userId);
        if(userData.success){
            setUserName((userData.data)['name']);
        }
    }catch(e:any){
        setOpen(true);
      setSnackText('Error fetching user details');
      setSnackSeverity('warning');
    }
  }
  const fetchCompletedTasks = async () => {
    if(!userId) return;
    try{
    const completedTask = await fetchData('completedTask', userId);
    if(completedTask.success){
        setCompletedTask(completedTask.data);
        setCount(Object.keys(completedTask.data).length);
    }
    }catch(e:any){

    }
  }

  const fetchTime = async () => {
    if(!userId) return;
    try{
        const timers = await fetchData('timer', userId);
        if(timers.success){
            setTimer({...timers.data});
        }
    }catch(e:any){}
  }
  
  fetchUserName();
  fetchData2();
  fetchCompletedTasks();
  fetchTime();
 
}, [userId]); // ✅ re-run when userId changes

useEffect(() => {
  if (!userId) return;

  const target = doc(db, 'completedTask', userId);
  const target2 = doc(db, 'tasks', userId);
  const timerDocRef = doc(db, 'timer', userId);

  const unsubscribeTasks = onSnapshot(target2, (snap) => {
    const data = snap.data();
    if (data) {
      setTaskLength(Object.keys(data).length);
    } else {
      setTaskLength(0);
    }
  });

  const unsubscribeCompleted = onSnapshot(target, (snap) => {
    const data = snap.data();
    if (data) {
      setCount(Object.keys(data).length);
    } else {
      setCount(0);
    }
  });

  const unsubscribeTimer = onSnapshot(timerDocRef, (snap) => {
    const data = snap.data();
    if (data) {
      setTimer(data);
    } else {
      setTimer({});
    }
  });

  // Cleanup on unmount
  return () => {
    unsubscribeTasks();
    unsubscribeCompleted();
    unsubscribeTimer();
  };
}, [userId]);



 useEffect(() => {
    if(!userId) return;
    const taskComplete = onSnapshot(doc(db,'completedTask', userId), (snapshot) => {
        if(snapshot.exists()){
            setCompletedTask(snapshot.data());
        }
        return () => taskComplete();
    });
 },[]);


    //Fetch Active Tasks on Load
    const FetchTaskActiveTasksOnLoad =  () => {
        const details = Object.values(tasks);
        return details.slice(0,3).map((element, index) => {
            // Use a stable color based on index or element property
            const stableColor = colors[index % colors.length];
            // Use a unique key if available, fallback to index
            const key = element.id ?? index;
            
            return (
                <ListTile
                    key={key}
                    leading={<input type="checkbox" checked={!!element['isCompleted']} onChange={ async(e) => {
                        setMarked(true);
                        const isNowChecked = e.target.checked;
                        try{
                            const docRef = doc(db, "completedTask", userId!);
                            const docSnap = await getDoc(docRef);

                            let newKey = "0";
                            let existingTasks: Record<string, any> = {};

                            if (docSnap.exists()) {
                             existingTasks = docSnap.data() as Record<string, any>;
                             const keys = Object.keys(existingTasks).map(Number);
                             const maxKey = keys.length > 0 ? Math.max(...keys) : -1;
                             newKey = String(maxKey + 1);
                            }
                            const data = await addOrUpdateUserData('completedTask',userId!,{
                            [newKey]:{
                             name:element['name'],
                             category:element['category'],
                            isCompleted: true
                            }});
                            if(data.success){
                                setOpen(true);
                                setSnackText('Task completed successfully');
                                setSnackSeverity('success');
                            }

                            const updateValue = doc(db,'tasks',userId!);
                            await updateDoc(updateValue, {
                                [`${key}.isCompleted`]: true
                            });

                            setTask((prevTasks: { [x: string]: any }) => ({
                            ...prevTasks,
                            [key]: {
                            ...prevTasks[key],
                            isCompleted: isNowChecked,
                            },
                            }));

                        }catch(e:any){

                        }
                    }} disabled={element['isCompleted']}/>}
                    title={element['name']}
                    trailing={<Wrap
                        content = {<small className="text-yellow-700 text-sm" style={{ fontSize: '8pt' }}>{element['category']}</small>}
                        colorValue = {stableColor}
                    />}
                    type="pack"
                    isUnderline={true}
                    titleStyle={{ fontSize: '10pt', fontWeight: 'bold' }}
                />
            );
        });
    }

    //Fetch Completed Tasks on Load
    const FetchTimerOnLoad = () => {
        const Time = Object.values(timer);
        return Time.slice(0,2).map((element, index) => {
            return (
            <ListTile
                 key={index}
                 leading = {<Wrap
                 content={<img src={'/clock.png'} style={{height:'20px',width:'20px'}}/>} 
                 colorValue="#ecf0f0"
                 height={'40px'}
                 width={40}
                 />
                }
                title={element['time']}
                titleStyle={{
                    fontSize:'9pt'
                }}
                Bold={true}
                subtitle={element['description']}
                subtitleStyle={{fontSize:'8pt', color:'black'}}
                type="trail" 
                isUnderline={true}   
                trailing={<div className="flex justify-center items-center gap-4">
                    <FontAwesomeIcon icon={faRedo} opacity={0.5} color={darkMode ? 'white':''} onClick={async() => {
                        try{
                            if(!userId) return;
                            const dataRef = doc(db,'timer',userId);
                            await updateDoc(dataRef,{
                                [`${index}.time`]:'00:00'
                            }).then(() => {
                                setOpen(true);
                                setSnackText('Success');
                                setSnackSeverity('success');
                            });

                            setTimer((prev: any[]) => ({
                            ...prev,
                             [index]: {
                            ...prev[index],
                            time: '00:00'
                            }
                            }));
                        }catch(e){}
                    }}/>
                    <img src={'/bin.png'} style={{...imgIcon}} onClick={async() => {
                         if(!userId) return;
                            const dataRef = doc(db,'timer',userId);
                            await updateDoc(dataRef,{
                                [`${index}`]:deleteField()
                            }).then(() => {
                                setOpen(true);
                                setSnackText('Deleted successfully');
                                setSnackSeverity('success');
                                setTimer((prev:any) => {
                                const updated = { ...prev };
                                delete updated[index]; // remove timer by index key
                                return updated;
                                });

                            });
                    }} />
                </div>}
                />
            );
        });
    }
          
    return <>
        {/* Container */}

        <div className="flex justify-center items-center flex-col w-full h-[90vh] gap-3">
            <div className="rounded-2xl shadow-2xl w-[100%] h-32 relative" style={{
                background: darkMode ? ThemeColor.shadowXg : `linear-gradient(to right, ${ThemeColor.primary}, white)`,
                boxSizing:'border-box',
                padding:'10px',
                boxShadow: darkMode ? ThemeColor.darkShadow!.heavy : ''
            }}>
                <img src={'/dart.png'} alt="Clarity Logo" className="w-24 h-24 rounded-full absolute right-5 bottom-1 -rotate-6"/>

                <h1 className="text-white font-bold text-xl ml-2 font-serif">Hello  <small className="text-gray-100 animate-pulse">&nbsp;{userName}!</small></h1>
                <p className="text-white opacity-75 ml-2 text-[10pt]">You've completed {taskCount} out of {taskLength}<br /> created tasks!</p>
                <SizedBox height={20}/>
                <Progress width={'65%'} height={'10px'} color={'white'} textColor={darkMode ? 'white':'black'} progressWidth={`${(taskCount / taskLength) * 100 }%`} text={`${Math.ceil((taskCount / taskLength) * 100) || 0}`}/>
            </div>
            <SizedBox height={20}/>
            {/* Second Container */}
            <div className="w-full rounded-3xl h-auto flex justify-center shadow items-center flex-col relative bg-white" style={{
                boxSizing:'border-box',
                padding:'20px',
                backgroundColor: darkMode ? ThemeColor.shadowXg : '',
                boxShadow: darkMode ? ThemeColor.darkShadow!.heavy : ''
            }}>
                    <div
                     className="flex items-center gap-2 absolute top-2 left-4 shadow-xl p-1 pr-2" style={{
                        borderBottomRightRadius:'20px',
                        backgroundColor: darkMode ? ThemeColor.dark : ''
                     }}>
                        <img src={'/list.png'} style={{height:'20px',width:'20px'}} />
                        <p className="text-blue-300 text-sm">Tasks</p>
                    </div>
               <SizedBox height={20}/>
               {/* Begin */}
               {Object.keys(tasks).length > 0 ? (
                 FetchTaskActiveTasksOnLoad()
                ) : (
                <div className="h-20 flex flex-col justify-center items-center w-full gap-3.5 opacity-40" onClick={() => setCurrentPageIndex(1)}>
                    <FontAwesomeIcon
                    icon={faPlus}
                    opacity={0.5}
                    style={{
                     height: '40px',
                     width: '40px',
                    }}
                    color={darkMode ? 'white':'black'}
                    />
                    <p style={{
                      color: darkMode ? 'white' : ''
                    }}>Click to add task</p>
                </div>
                )}

                <SizedBox height={10}/>

                <Button variant={darkMode ? 'text':'text'} className="relative top-3" color={darkMode ? 'secondary':'inherit'} style={{color:darkMode ? 'white':ThemeColor.primary}} size={'small'} onClick={() => setCurrentPageIndex(1)}>View all Tasks</Button>
            </div>
            {/* End */}
            <SizedBox height={20}/>
                {/* Third Container */}

             <div className="w-full rounded-3xl h-auto shadow relative flex justify-center items-center flex-col" style={{
              backgroundColor: darkMode ? ThemeColor.shadowXg : '',
              boxShadow: darkMode ? ThemeColor.darkShadow!.heavy : ''
             }}>
                <div
                     className="flex justify-center items-center gap-2 ml-2 absolute top-2 left-2 p-1 pr-2 shadow-xl" style={{
                        borderBottomRightRadius:'20px',
                        backgroundColor: darkMode ? ThemeColor.dark : ''
                     }}>
                        <img src={'/3d-alarm.png'} style={{...imgIcon}} />
                        <p className="text-blue-300 text-sm">Timers</p>
                </div>
                <SizedBox height={35}/>
                {Object.keys(timer).length > 0 ? (
                 FetchTimerOnLoad()
                ) : (
                <div className="h-20 flex flex-col justify-center items-center w-full gap-3.5 opacity-40" onClick={() => setCurrentPageIndex(2)}>
                    <FontAwesomeIcon
                    icon={faPlus}
                    opacity={0.5}
                    style={{
                     height: '40px',
                     width: '40px',
                    }}
                    color={darkMode ? 'white':''}
                    />
                    <p style={{
                      color: darkMode ? 'white' : 'black'
                    }}>Click to add timer</p>
                </div>
                )}
                <SizedBox height={10}/>
                {/* Button */}
                <Button variant={
                  darkMode ? 'text':'text'
                  } className="absolute -bottom-2" color={darkMode ? 'primary':'inherit'} style={{color:darkMode ? 'white':ThemeColor.primary}} onClick={() => setCurrentPageIndex(2)}>View all Timers</Button>
                <SizedBox height={20}/>

            </div>
        </div>    
    </>
}

export default Home;