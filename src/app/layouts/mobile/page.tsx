'use client'
import { faBars, faBell, faBook, faCircle, faClipboardList, faClock, faGear, faHome, faNoteSticky, faPause, faPlay, faRedo, faTasks, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import AppBar from "../../components/AppBar";
import BottomNav from "../../components/bottomNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListTile from "../../components/ListTile";
import Wrap from "../../components/wrap";
import SizedBox from "../../hooks/SizedBox";
import { Button } from "@mui/material";
import { JSX, useEffect, useRef, useState } from "react";
import Progress from "../../components/loader_div";
import Home from "../../pages/Home/subpages/Home";
import TaskPage from "../../pages/Home/subpages/tasks";
import { useWatch } from "../../hooks/page_index";
import TimerPage from "../../pages/Home/subpages/timer";
import Settings from "../../pages/Home/subpages/settings";
import Overlay from "../../components/overlay";
import MultiTimerPage from "../../pages/Home/subpages/timer";
import { UseFirebase } from "@/app/hooks/firebase_hooks";
import { toast } from "react-toastify";
import { imgIcon } from "@/app/static/styles";

const MobileLayout:React.FC = () => {

    const {currentPageIndex,setCurrentPageIndex,
          taskCount, taskLength,
          setCount, setTaskLength,
          FlexStart,tasks, userId} = useWatch();
    const {fetchData} = UseFirebase();
    const [keyValue, setKeyValue] = useState<Record<any,any>>({});
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        divRef.current?.scrollTo(0,0);
    },[]);

    useEffect(() => {
        const fetchData2 = async () => {
            if(!userId) return;
            try{
                const data = await fetchData('tasks',userId);
                if(data.success){
                    setKeyValue({...data.data});
                }
            }catch(e:any){

            }
        }
        fetchData2();
    },[userId,fetchData]);

    useEffect(() => {
        if(taskCount > taskLength){
            setCount(taskLength);
        }
    }, [taskCount, taskLength, setCount]);

    const pages:JSX.Element[] = [
    <Home/>,
    <TaskPage/>,
    <TimerPage/>,
    <Settings/>
    ]

    
    const homeIcon = ('/home.png');
    const taskIcon = ('/list.png');
    const timeIcon = ('/clock.png');
    const gearIcon = ('/settings.png');
  
    return <>
    {/* Page initial */}
        <div className="w-full">
            <AppBar
             title={'Clarity tasks'}
             trailing={[
                faBell,
                faCircle
             ]}
             onTrailingPressed={(index:number) => {
             }}
             onLeadingPressed={()=>{
                setCount(taskCount + 1); 
             }}
            />
            {/* Body */}
            <div
            ref={divRef}
            className="px-4 py-6 overflow-auto max-h-[80vh] mt-10"
                >
                {currentPageIndex < pages.length ? (
                pages[currentPageIndex]
            ) : (
            <div className="flex justify-center items-center h-[95vh]">
            <h1>No Page yet</h1>
            </div>
            )}
        </div>

            {/* End */}
        
              <SizedBox height={100}/>
             <BottomNav
              icons={[homeIcon,taskIcon,timeIcon,gearIcon]}
              labels={['Home','Tasks','Timer','Settings']}
              onPressed={(index) => setCurrentPageIndex(index)}
              type={'image'}
              />
              <Overlay/>
        </div>
        {/* End */}
    </>
}

export default MobileLayout;