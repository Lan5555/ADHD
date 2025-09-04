'use client'
import AddComponent from "@/app/components/add_item"
import Fact from "@/app/components/fact"
import ListTile from "@/app/components/ListTile"
import Progress from "@/app/components/loader_div"
import MoodChecker from "@/app/components/mood_checker"
import Wrap from "@/app/components/wrap"
import { UseFirebase } from "@/app/hooks/firebase_hooks"
import { useWatch } from "@/app/hooks/page_index"
import SizedBox from "@/app/hooks/SizedBox"
import Destroy from "@/app/hooks/tools"
import { ThemeColor, ThemeColorSpecific } from "@/app/static/colors"
import { auth, db } from "@/app/static/firebase"
import { imgIcon } from "@/app/static/styles"
import { faClipboardList, faClock, faRedo, faPause, faPlay, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "@mui/material"
import { onAuthStateChanged } from "firebase/auth"
import { deleteField, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { CSSProperties, useEffect, useState } from "react"
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { easeOut } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100
    }
  }
};

const progressVariants = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: {
      duration: 1,
      ease: easeOut // use a valid easing function
    }
  }
};

const Home:React.FC = () => {
    
    const {facts,setShowJournal,setCurrentPageIndex,
          taskCount, taskLength,
          mounted, setMounted,
          setCount, setTaskLength,
          availableJournals,tasks,setAvailableJournals, timer,setShowJournalMain,userId,setTask, setCompletedTask,setTimer, setOpen, setSnackSeverity, setSnackText,darkMode} = useWatch();
    const colors:string[] = Object.values(ThemeColorSpecific);
    const {fetchDataByQuery,fetchData, addOrUpdateUserData} = UseFirebase();
    const [userName, setUserName] = useState<string>('');
    const [marked, setMarked] = useState<boolean>(false);
    const [displayItem, setDisplayItem] = useState<boolean>(false);
    const route = useRouter();

  useEffect(() => {
    const fetchData2 = async () => {
      if (!userId) return;

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
      }catch(e:any){}
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

    const fetchJournals = async():Promise<void> => {
      const dataRef = doc(db,'journals', userId!);
      const dataCheck = await getDoc(dataRef);
      if(dataCheck.exists()){
        const data = dataCheck.data() as any;
        setAvailableJournals(data);
      }else{
        setAvailableJournals({}) ;
      }
    }

    fetchJournals();
    fetchUserName();
    fetchData2();
    fetchCompletedTasks();
    fetchTime();
  }, [userId]);

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
    const delayBeforeDisplaying = () => {
      setTimeout(() => {
        setDisplayItem(true);
      },2000);
    }
    delayBeforeDisplaying();
  },[]);

  const FetchTaskActiveTasksOnLoad =  () => {
    const details = Object.values(tasks);
    return details.slice(0,3).map((element, index) => {
        const stableColor = colors[index % colors.length];
        const key = element.id ?? index;
        
        return (
          <motion.div
            key={key}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <ListTile
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

                    }catch(e:any){}
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
          </motion.div>
        );
    });
  }

  const FetchTimerOnLoad = () => {
    const Time = Object.values(timer);
    return Time.slice(0,2).map((element, index) => {
        return (
          <motion.div
            key={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <ListTile
                 leading = {<Wrap
                 content={<motion.img 
                   src={'/clock.png'} 
                   style={{height:'20px',width:'20px'}}
                   whileHover={{ rotate: 360 }}
                   transition={{ duration: 0.5 }}
                 />} 
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
                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
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
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
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
                                  delete updated[index];
                                  return updated;
                                  });
                              });
                      }} />
                    </motion.div>
                </div>}
                />
          </motion.div>
        );
    });
  }
          
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center flex-col w-full h-[90vh] gap-3"
      >
        {/* Mood check */}
        <AnimatePresence>
          {mounted && (
            <motion.div
              className="flex justify-center items-center w-full h-screen fixed top-0 left-0 z-50 pop-up"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <MoodChecker emojis={['😀', '😐', '😔', '😡', '😴']} text="How are you feeling today?"/>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header Card */}
        <motion.div 
          className="shadow-2xl w-[100%] h-32 relative" 
          style={{
            background: darkMode ? `linear-gradient(to right, ${ThemeColor.darkMode},white)` : `linear-gradient(to right, ${ThemeColor.primary}, white)`,
            boxSizing:'border-box',
            padding:'10px',
            boxShadow: darkMode ? ThemeColor.darkShadow!.heavy : '',
            borderLeft: darkMode ? `2px solid ${ThemeColor.primary}`:'',
            borderRadius: darkMode ? '8px': '1rem'
          }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.img 
            src={'/dart.png'} 
            alt="Clarity Logo" 
            className="w-24 h-24 rounded-full absolute right-5 bottom-1 -rotate-6"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 50 }}
          />

          <motion.h1 
            className="text-white font-bold text-xl ml-2 font-serif"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Hello <motion.small 
              className="text-gray-100"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >&nbsp;{userName}!</motion.small>
          </motion.h1>
          
          <motion.p 
            className="text-white opacity-75 ml-2 text-[10pt]"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 0.75 }}
            transition={{ delay: 0.3 }}
          >
            You've completed {taskCount} out of {taskLength}<br /> created tasks!
          </motion.p>
          
          <SizedBox height={20}/>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={progressVariants}
          >
            <Progress 
              width={'65%'} 
              height={'10px'} 
              color={'white'} 
              textColor={darkMode ? 'black':'black'} 
              progressWidth={`${(taskCount / taskLength) * 100 }%`} 
              text={`${Math.ceil((taskCount / taskLength) * 100) || 0}`}
            />
          </motion.div>
        </motion.div>
        
        <SizedBox height={20}/>
        
        {/* Tasks Container */}
        <motion.div 
          className="w-full rounded-3xl h-auto flex justify-center shadow items-center flex-col relative bg-white" 
          style={{
            boxSizing:'border-box',
            padding:'20px',
            backgroundColor: darkMode ? ThemeColor.darkMode : '',
            boxShadow: darkMode ? ThemeColor.darkShadow!.heavy : '',
            borderLeft: darkMode ? `2px solid lightgreen`:'',
            borderRadius: darkMode ? '8px': '1rem'
          }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex items-center gap-2 absolute top-2 left-4 shadow-xl p-1 pr-2" 
            style={{
              borderBottomRightRadius:'20px',
              backgroundColor: darkMode ? ThemeColor.dark : ''
            }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.img 
              src={'/list.png'} 
              style={{height:'20px',width:'20px'}} 
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
            />
            <p className="text-blue-300 text-sm">Tasks</p>
          </motion.div>
          
          <SizedBox height={20}/>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            {Object.keys(tasks).length > 0 ? (
              FetchTaskActiveTasksOnLoad()
            ) : (
              <motion.div 
                className="h-20 flex flex-col justify-center items-center w-full gap-3.5 opacity-40" 
                onClick={() => setCurrentPageIndex(1)}
                whileHover={{ scale: 1.05, opacity: 0.8 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    opacity={0.5}
                    style={{
                      height: '40px',
                      width: '40px',
                    }}
                    color={darkMode ? 'white':'black'}
                  />
                </motion.div>
                <p style={{
                  color: darkMode ? 'white' : ''
                }}>Click to add task</p>
              </motion.div>
            )}
          </motion.div>

          <SizedBox height={10}/>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant={darkMode ? 'text':'text'} 
              className="relative top-3" 
              color={darkMode ? 'secondary':'inherit'} 
              style={{color:darkMode ? 'white':ThemeColor.primary}} 
              size={'small'} 
              onClick={() => setCurrentPageIndex(1)}
            >
              View all Tasks
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Journal Container */}
        <SizedBox height={10}/>
        
        <AnimatePresence mode="wait">
          {Object.keys(availableJournals).length > 0 ? (
            <motion.div 
              key="journal-exists"
              className="w-full rounded h-auto shadow relative flex justify-center items-center flex-col"
              style={{
                backgroundColor: darkMode ? ThemeColor.darkMode : '',
                boxShadow: darkMode ? ThemeColor.darkShadow!.heavy : '',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ListTile 
                type="trail"
                isUnderline={false}
                leading={
                  <motion.div whileHover={{ rotate: 10 }}>
                    <Wrap
                      content={<img src={'/list.png'} style={{height:'20px',width:'20px'}}/>}
                      colorValue="#f39c12"
                    />
                  </motion.div>
                }
                title="Journal"
                subtitle="Write your thoughts and feelings"
                subtitleStyle={{fontSize:'8pt', color:darkMode ? 'white':''}}
                Bold={true}
                titleStyle={{fontSize:'10pt', fontWeight:'bold',color:darkMode ? 'white':''}}
                trailing={
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button 
                      variant={darkMode ? 'text':'text'} 
                      style={{color:darkMode ? 'white':ThemeColor.primary}} 
                      size={'small'} 
                      onClick={() => {
                        route.push('/pages/Journal');
                      }}
                    >
                      View
                    </Button>
                  </motion.div>
                }
              />
            </motion.div>
          ) : (
            <motion.div
              key="journal-add"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full rounded-3xl h-44 shadow relative flex justify-center items-center flex-col"
            >
              <AddComponent
                image={'/list.png'}
                viewText="View all Journals"
                viewCallBack={() => {
                  setShowJournalMain(true)
                  route.push('/pages/Journal');
                }}
                title="Journals"
                name="Journal" 
                callback={() => {
                  setShowJournal(true);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <SizedBox height={20}/>
        
        {/* Timer Container */}
        <motion.div 
          className="w-full rounded-3xl h-auto shadow relative flex justify-center items-center flex-col" 
          style={{
            backgroundColor: darkMode ? ThemeColor.darkMode : '',
            boxShadow: darkMode ? ThemeColor.darkShadow!.heavy : '',
            borderLeft: darkMode ? `2px solid yellow`:'',
            borderRadius: darkMode ? '8px': '1rem'
          }}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex justify-center items-center gap-2 ml-2 absolute top-2 left-2 p-1 pr-2 shadow-xl" 
            style={{
              borderBottomRightRadius:'20px',
              backgroundColor: darkMode ? ThemeColor.dark : ''
            }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.img 
              src={'/3d-alarm.png'} 
              style={{...imgIcon}} 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <p className="text-blue-300 text-sm">Timers</p>
          </motion.div>
          
          <SizedBox height={35}/>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
          >
            {Object.keys(timer).length > 0 ? (
              FetchTimerOnLoad()
            ) : (
              <motion.div 
                className="h-20 flex flex-col justify-center items-center w-full gap-3.5 opacity-40" 
                onClick={() => setCurrentPageIndex(2)}
                whileHover={{ scale: 1.05, opacity: 0.8 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    opacity={0.5}
                    style={{
                      height: '40px',
                      width: '40px',
                    }}
                    color={darkMode ? 'white':''}
                  />
                </motion.div>
                <p style={{
                  color: darkMode ? 'white' : 'black'
                }}>Click to add timer</p>
              </motion.div>
            )}
          </motion.div>
          
          <SizedBox height={10}/>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant={darkMode ? 'text':'text'} 
              className="absolute -bottom-2" 
              color={darkMode ? 'primary':'inherit'} 
              style={{color:darkMode ? 'white':ThemeColor.primary}} 
              onClick={() => setCurrentPageIndex(2)}
            >
              View all Timers
            </Button>
          </motion.div>
          
          <SizedBox height={20}/>
          
          <AnimatePresence>
            {displayItem && !mounted && (
              <motion.div
               className="flex justify-center items-center w-full h-52 fixed top-0 left-0 pop-up"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Destroy delay={30} className="fixed top-32 w-full p-2 flex justify-center items-center">
                  <Fact content={facts || 'No data received'}></Fact>
                </Destroy>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
}

export default Home;