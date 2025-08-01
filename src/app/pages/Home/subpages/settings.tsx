import ListTile from "@/app/components/ListTile";
import { useWatch } from "@/app/hooks/page_index";
import SizedBox from "@/app/hooks/SizedBox";
import { ThemeColor } from "@/app/static/colors";
import { imgIcon } from "@/app/static/styles";
import { faBell, faSun, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@mui/material";
import { useRouter } from "next/navigation";

const Settings:React.FC = () => {
    const {setActivePageIndex,setCurrentUserId} = useWatch();
    const route = useRouter();
    return <>
        <div className="w-full flex justify-center items-center flex-col gap-3">
        <div className="flex justify-start flex-col gap-2 shadow w-full p-2 rounded-2xl">
        <h4>Toggle view mode</h4>

        <ListTile leading={<FontAwesomeIcon icon={faSun}/>}
        title={'Realtime view mode'}
        titleStyle={{fontSize:'10pt'}}
        trailing={<Switch/>}
        type="trail"
        />
        </div>

        <SizedBox height={10}/>
        <div className="flex justify-start flex-col gap-2 shadow w-full p-2 rounded-2xl">
        <h4>Notifications</h4>
        <ListTile leading={<img src={'/bell.png'} style={{height:'20px',width:'20px'}}/>}
        title={'Enable Notifications'}
        titleStyle={{fontSize:'10pt'}}
        trailing={<input type="checkbox" onChange={() => {}}/>}
        type="trail"
        />
        </div>
        <SizedBox height={10}/>
        <div className="flex justify-start flex-col gap-2 shadow w-full p-2 rounded-2xl" onClick={() => {
            setActivePageIndex(0);
            setCurrentUserId(null);
        }}>
        <h4>Log out</h4>
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