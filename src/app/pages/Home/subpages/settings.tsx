import ListTile from "@/app/components/ListTile";
import { useWatch } from "@/app/hooks/page_index";
import SizedBox from "@/app/hooks/SizedBox";
import { ThemeColor } from "@/app/static/colors";
import { db } from "@/app/static/firebase";
import { imgIcon } from "@/app/static/styles";
import { faBell, faLongArrowAltDown, faSun, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const Settings:React.FC = () => {
    const {darkMode,setActivePageIndex,setCurrentUserId, userId} = useWatch();
    const [mood,setMood] = useState<string>('');
    const [moodText, setMoodText] = useState<string>('');
    useEffect(() => {
        const fetchStatus = async() => {
            try{
                const dataRef = doc(db,'moodChecks',userId!);
                const docSnap = await getDoc(dataRef);
                if(docSnap.exists()){
                    const data = docSnap.data();
                    setMood(data.lastMood['emoji']);
                }
            }catch(e:any){
                console.log(e);
            }
        }
        fetchStatus();
    },[]);
    useEffect(() => {
        const checkMood = () => {
            if(mood === '😀')
                setMoodText('Happy');
            else if(mood === '😐')
                setMoodText('Neutral');
            else if(mood === '😔')
                setMoodText('Sad');
            else if(mood === '😡')
                setMoodText('Angry');
            else if(mood === '😴')
                setMoodText('Tired');       
        }
        checkMood();
    },[mood]);
    return <>
        <div className="w-full flex justify-center items-center flex-col gap-3">
        <div className="flex justify-start flex-col gap-2 shadow w-full p-2 rounded-2xl" style={{
            boxShadow: darkMode ? ThemeColor.darkShadow!.heavy : '',
            
        }}>
        <h4 style={{
            color: darkMode ? 'white':''
        }}>Toggle view mode</h4>

        <ListTile leading={<FontAwesomeIcon icon={faSun} color={darkMode ? 'white':''}/>}
        title={'Realtime view mode'}
        titleStyle={{fontSize:'10pt'}}
        trailing={<Switch checked disabled/>}
        type="trail"
        />
        </div>

        <SizedBox height={10}/>
        <div className="flex justify-start flex-col gap-2 shadow w-full p-2 rounded-2xl" style={{
            boxShadow: darkMode ? ThemeColor.darkShadow!.heavy : ''
        }}>
        <h4 style={{
            color: darkMode ? 'white':''
        }}>Mood status</h4>
        <ListTile leading={<img src={'/bell.png'} style={{height:'20px',width:'20px'}}/>}
        title={'Mood'}
        subtitle={mood ? `Current mood: ${mood} You are ${moodText}` : 'No mood set'}
        titleStyle={{fontSize:'10pt'}}
        trailing={<FontAwesomeIcon icon={faLongArrowAltDown} color={darkMode ? 'white':''}/>}
        type="trail"
        />
        </div>
        <SizedBox height={10}/>
        <div className="flex justify-start flex-col gap-2 shadow w-full p-2 rounded-2xl" onClick={() => {
            setActivePageIndex(0);
            setCurrentUserId(null);
        }} style={{
            boxShadow: darkMode ? ThemeColor.darkShadow!.light : ''
        }}>
        <h4 style={{
            color: darkMode ? 'white':''
        }}>Log out</h4>
        <ListTile leading={<img src={'/user.png'} style={{height:'20px',width:'20px'}}/>}
        title={'Sign out'}
        titleStyle={{fontSize:'10pt'}}
        type="trail"
        />
        </div>

        </div>
    </>
}

export default Settings;