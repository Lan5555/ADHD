'use client'
import ShowBottomSheet from "@/app/components/bottom_sheet"
import DropDown from "@/app/components/dropdown"
import ListTile from "@/app/components/ListTile"
import Overlay from "@/app/components/overlay"
import ToolBar from "@/app/components/toolkit"
import Wrap from "@/app/components/wrap"
import { UseFirebase } from "@/app/hooks/firebase_hooks"
import { useWatch } from "@/app/hooks/page_index"
import SizedBox from "@/app/hooks/SizedBox"
import { ThemeColor, ThemeColorSpecific } from "@/app/static/colors"
import { db } from "@/app/static/firebase"
import useLocalStorage from "@/app/static/save"
import { imgIcon } from "@/app/static/styles"
import { faAngleDown, faClock, faEllipsisH, faPlus, faQuestion, faSearch } from "@fortawesome/free-solid-svg-icons"
import { faClipboardList } from "@fortawesome/free-solid-svg-icons/faClipboardList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Fab, Switch } from "@mui/material"
import { deleteDoc, deleteField, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"

const TaskPage:React.FC = () => {
    const [comingTasks,setComingTasks] = useState<number>(3);
    const [completedTasks,setCompletedTasks] = useState<number>(3);
    const colors:string[] = Object.values(ThemeColorSpecific);
    const {tasks, completedTask, setToolBarShown, showOverlay, setTask,userId, setCurrentPageIndex,taskLength, setIsAsking, setOpen,setSnackSeverity,setSnackText} = useWatch();
    const [nameValue, setNameValue] = useState('');
    const [cat, setCategory] = useState('chores');
    const [completed, setCompleted] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const {SaveToLocalStorage, FetchFromLocalStorage} = useLocalStorage();
    const {addOrUpdateUserData} = UseFirebase();
    const [showSheet, setCurrentSheetState] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchTime, setSearchTime] = useState<boolean>(false);
    const [taskList, setTaskList] = useState<string[]>([]);
    const [foundTask, setFounTask] = useState<string>('');
    const [dropdownState, setDropDownState] = useState<boolean>(false);
    const dropDownRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [visible, seVisible] = useState<boolean>(false);
    const {darkMode} = useWatch();
    
     function byPass(){
      setTimeout(() => {
        SaveToLocalStorage('persistent-timer', currentTime,'time');
      },500);
    }

    // Fetch Tasks on Load
    const FetchTasksOnLoad = () => {
        const details = Object.values(tasks);
        localStorage.setItem('tasks',JSON.stringify(tasks))
        return details.map((element, index) => {
            // Use a stable color based on index or element property
            const stableColor = colors[index % colors.length];
            // Use a unique key if available, fallback to index
            const key = element.id ?? index;
            return(
            <ListTile
            key={key}
             leading={<input type="checkbox" checked={!!element['isCompleted']}
              onChange={async(e) => {
              const isNowChecked = e.target.checked;
              try{
                const dataRef = doc(db,'completedTask',userId!);
                const docSnap = await getDoc(dataRef);
                let newKey = "0";
                let existingTasks = {} as Record<string,any>;
                if (docSnap.exists()) {
                  existingTasks = docSnap.data() as Record<string, any>;
                  const keys = Object.keys(existingTasks).map(Number);
                  const maxKey = keys.length > 0 ? Math.max(...keys) : -1;
                  newKey = String(maxKey + 1);
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
                }
              }catch(e){

              }}}/>} title={element['name']} trailing={<Wrap
            content = {<small className="text-red-600 text-sm" style={{
                fontSize:'8pt'
            }}>{element['category']}</small>}
            colorValue = {stableColor}
        />} type="pack"
        isUnderline={true}
        titleStyle={{fontSize:'9pt', fontWeight:'bold'}}
        trailPack={<div className="flex flex-col" onClick={async() => {
          if(!userId) return;
          const dataRef = doc(db,'tasks',userId);
          await updateDoc(dataRef,{
            [`${key}`]:deleteField()
          }).then(() => {
            setOpen(true);
            setSnackText('Deleted successfully');
            setSnackSeverity('success');
            setTask(tasks);
            setTask((prev:any) => {
              const updated = {...prev};
              delete updated[key];
              return updated;
            })
          })

        }}>
           <img src='/bin.png' style={{...imgIcon}}/>
        </div>}
        />
            )
        });
    }

    // Fetch Completed Tasks on Load
    const FetchCompletedTaskOnLoad = () => {
        const details = Object.values(completedTask);
        return details.map((element, index) => {
            // Use a stable color based on index or element property
            const stableColor = colors[index % colors.length];
            // Use a unique key if available, fallback to index
            const key = element.id ?? index;
            return (
                <ListTile
                key={key}
            leading={
            <input
              type="checkbox"
              checked
              onChange={() => {}}
              style={{
                accentColor: "green",
              }}
            />
            }
            title={element['name']}
            trailing={<Wrap
            content = {
              <small
                className="text-yellow-700 text-sm"
                style={{
                fontSize: "8pt",
                }}
              >
                {element['category']}
              </small>
              }
            colorValue = {stableColor}
            />}
            type="pack"
            isUnderline={true}
            titleStyle={{ fontSize: "9pt", fontWeight: "bold" }}
            trailPack={
            <div className="flex flex-col">
              <FontAwesomeIcon icon={faEllipsisH} className="text-gray-300" />
              <FontAwesomeIcon
                icon={faEllipsisH}
                className="text-gray-300 relative bottom-1"
              />
            </div>
            }
          />
            );
        });
    }

    //Handle tasks
    
   const HandleTaskChange = async(index: number) => {
   switch (index) {
    case 0:
      if(nameValue != ''){
      const taskLength = Object.keys(tasks).length + 1;
      setTask((prev: any) => ({
        ...prev,
        [taskLength]: {
          name: nameValue,
          category: cat,
          isCompleted: completed
        }
      }));
      showOverlay(false);
      setToolBarShown(false);
      setNameValue('');
      byPass();
      //Set to database
      try{
            const docRef = doc(db, "tasks", userId!);
            const docSnap = await getDoc(docRef);

            let newKey = "0";
            let existingTasks: Record<string, any> = {};

            if (docSnap.exists()) {
              existingTasks = docSnap.data() as Record<string, any>;
              const keys = Object.keys(existingTasks).map(Number);
              const maxKey = keys.length > 0 ? Math.max(...keys) : -1;
              newKey = String(maxKey + 1);
           }
         const data = await addOrUpdateUserData('tasks',userId!,{
            [newKey]:{name:nameValue,
            category:cat,
            isCompleted: completed
          }});

        if(data.success){
          setIsAsking(true);
          setOpen(true);
          setSnackText('Updated successfully now add a timer');
          setSnackSeverity('success');
          setCurrentPageIndex(2);
        }else if(data.error){
          toast.warning(data.error);
        }
      }catch(e:any){
          setOpen(true);
      setSnackText('Something went wrong');
      setSnackSeverity('warning');
      }
    }else{
      setOpen(true);
      setSnackText('Type something');
      setSnackSeverity('info');
    }
    //End
      break;
    case 1:
      showOverlay(false);
      setToolBarShown(false);
      break;
  }
}

useEffect(() => {
  const names = Object.values(tasks)
    .map((task: any) => task.name)
    .filter(Boolean); // removes undefined/null names

  setTaskList(names);
}, [userId, tasks]);


useEffect(() => {
  if(textRef.current){
     setFounTask(textRef.current.textContent || '');
  }
},[textRef.current?.textContent]);


useEffect(() => {
  if(!userId) return;
  const taskRef = doc(db,'tasks',userId);
    const unSubscribe = onSnapshot(taskRef,(data) => {
      const result = data.data();
      if(result){
        setTask(result)
      }
      return () => unSubscribe();
    });
},[userId])


    return <>
    <div className="flex justify-center items-center gap-3 w-full flex-col p-3">
        {/* Search and Categories */}
        <div className="flex justify-center items-center p-2 gap-4">
        <div 
          ref={dropDownRef}
          className="w-52 h-9 rounded-3xl bg-gray-100 flex justify-center items-center relative" style={{
            border: '1px solid rgba(0,0,0,0.1)',
        }}>
        <FontAwesomeIcon icon={faSearch} style={{
            width:'13px',
            height:'13px',
        }} className="absolute left-4"/>
        <input 
        ref={inputRef}
        type="text" placeholder="Search tasks" className="w-full p-2 rounded-3xl bg-transparent outline-none border-none text-sm" style={{
            paddingLeft:'40px',
        }} onChange={(e) => setSearchValue(e.target.value)}></input>
       </div>
       { searchValue != '' && (
       <DropDown target={dropDownRef.current!}>
  {taskList
    .filter((name) => name.toLowerCase().includes(searchValue.toLowerCase()))
    .map((name, index) => (
      <p
        key={index}
        onClick={() => {
          inputRef.current!.value = '';
          setSearchValue('');
          setSearchTime(prev => !prev);
          showOverlay(true);
          setFounTask(name); // Optionally set the clicked task
        }}
        style={{ cursor: 'pointer', padding: '4px 8px' }}
      >
        {name}
      </p>
    ))}
  </DropDown>

       )
       }
       <div className="w-24 h-9 rounded-3xl bg-gray-100 flex justify-center items-center gap-1" style={{
        border: '1px solid blueviolet',
       }} onClick={() => {
          setCurrentSheetState(prev => !prev);
          showOverlay(true);
       }}>
        <p className="text-violet-700 text-[8pt]">All categories</p>
        <FontAwesomeIcon icon={faAngleDown} className="text-violet-700" style={{
            width:'13px',
            height:'13px',
        }}/>
       </div>

       </div>
       {/* End */}
       <div className="w-full rounded-2xl shadow p-2 relative" style={{
        borderLeft: darkMode ? `3px solid ${ThemeColor.primary}`:''
       }}>
        <h2 className="text-gray-400 text-sm">Upcoming tasks: {taskLength}</h2>
        {Object.keys(tasks).length > 0 ? (
          FetchTasksOnLoad()
          ) : (
          <div className="h-20 flex flex-col justify-center items-center w-full gap-3.5 opacity-40" onClick={() => {
            setCurrentPageIndex(1);
            setToolBarShown(true);
            showOverlay(true);
            
            }}>
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
                color: darkMode ? 'white' : 'black'
              }}>Click to add task</p>
              </div>
        )}
        
         <SizedBox height={15}/>
          <Button variant={'text'} size={'small'} onClick={async() => {
            if(!userId) return;
            const dataRef = doc(db,'tasks',userId);
            await deleteDoc(dataRef)
            .then(() => {
              setOpen(true);
              setSnackText('Deleted data successfully');
              setSnackSeverity('success');
              setTask({})
            });
          }}>
            Delete all tasks
          </Button>
       </div>
       {/* End */}
         <SizedBox height={5}/>
        <div className="w-full rounded-2xl shadow p-2 opacity-50" style={{
          borderLeft: darkMode ? `3px solid ${ThemeColor.green}`:''
        }}>
        <h2 className="text-gray-400 text-sm">Completed tasks: {Object.keys(comingTasks).length}</h2>
        {FetchCompletedTaskOnLoad()}
          <SizedBox height={25} />
        </div>
        <Fab
          variant="extended"
          color="primary"
          sx={{
            borderRadius: '16px',
            boxShadow: 3,
            textTransform: 'none',
            fontWeight: 'bold',
            position: 'fixed',
            bottom: '80px',
            right: '30px',
            backgroundColor: ThemeColor.primary,
          }}
        >
         <FontAwesomeIcon icon={faClipboardList} style={{
            height: '20px',
            width: '20px',
         }} onClick={() => {
          showOverlay(true);
          setToolBarShown(true);
          }
           }
           />
        </Fab>
        <ToolBar 
           content={<div className="flex justify-center items-center flex-col gap-5 w-60">
          <h4 className="text-sm">Task description</h4>
          <input type="text" placeholder="Enter task description" className="w-full p-2 rounded-xl bg-gray-100 outline-none border-none text-sm" style={{
            paddingLeft: '10px',
          }} onChange={(el) => setNameValue(el.target.value)}/>
          <label htmlFor="set-category" className="text-sm">Select Category</label>
          <select name="category" className="w-full p-2 rounded-lg bg-gray-100 outline-none border-none" id="set-category" onChange={(val) => setCategory(val.target.value)}>
            <option value="chores">Chores</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>
        </div>} type={'question'} onPressed={(index) => HandleTaskChange(index)}/>
            </div>
            <Overlay/>
            <ShowBottomSheet style={{
              bottom: !showSheet ? '-500px' : '0px',
              height:'20vh',
              backgroundColor:'white',
              boxShadow:'0px 4px 8px rgba(0,0,0,1)',
              zIndex:100
            }} onClose={() => {
              setCurrentSheetState(false);
              showOverlay(false);
              }}>
              <div className="flex justify-center items-center p-2 gap-3 mt-20">
                {['Chores','Personal','Work','Other'].map((element,index) => (

                  <div
                  key={index}
                   className="rounded-xl p-2 flex justify-center items-center" style={{
                    border:'1px solid rgba(0,0,0,0.1)'
                   }}>
                    {element}
                  </div>
               ))}
              </div>
            </ShowBottomSheet>
            <ShowBottomSheet style={{
              bottom: !searchTime ? '-500px': '0px',
              backgroundColor:'white',
              boxShadow:'0px 4px 8px rgba(0,0,0,1)',
              zIndex:100
            }} onClose={() => {
              setSearchTime(false);
              showOverlay(false);
            }}>
              
            <div className="flex justify-center items-center gap-2 flex-col">
              <h2 className="font-bold mt-10">Details below</h2>
              <p className="text-lg text-blue-600">{foundTask || 'No tasks available'}</p>
              <h2 className="text-sm">Queried time</h2>
              <p>{new Date().toISOString()}</p>
              <p className="text-sm">Click on the timer icon to monitor</p>
            </div>
            
            </ShowBottomSheet>
    </>
}
export default TaskPage;