import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faHome, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useWatch } from "../hooks/page_index"
import { ThemeColor } from "../static/colors"

interface props{
    leading?:IconDefinition,
    title:String,
    subtitle?:String
    trailing:IconDefinition[],
    onLeadingPressed?: () => void,
    onTrailingPressed?:(index:number) => void
}
const AppBar:React.FC<props> = ({leading,title,subtitle,trailing, onTrailingPressed, onLeadingPressed}) => {
    const {darkMode} = useWatch();
    return <div className="w-full h-14 p-2 shadow-xg flex justify-between items-center bg-white fixed top-0 z-40" style={{
        borderBottomLeftRadius:'32px',
        backgroundColor: darkMode ? ThemeColor.darkMode : 'white',
        boxShadow: darkMode ? ThemeColor.darkShadow!.heavy : 'white'
    }}>
        <div className="flex justify-center items-center gap-3 pl-3">

            {leading && <FontAwesomeIcon icon={leading || faUser} onClick={() => {
            if(onLeadingPressed){
                onLeadingPressed();
            }
            }} className="text-black"/>}
            <h1 className="text-black font-bold font-serif" style={{
                color: darkMode ? 'white':''
            }}>{title}</h1>
        </div>
        {subtitle === null ? null : (<small>{subtitle}</small>)}
        <div className="flex justify-center items-center gap-5 mr-3">
        {trailing.map((icon, index) => (
            <div key={index}
            className="relative flex justify-center items-center w-8 h-8 shadow"
            style={{
                borderRadius: '10px',
                padding: '6px',
                backgroundColor: darkMode ? ThemeColor.darkMode : 'white',
            }}
            title={index == 0 ? 'Notifications' : index == 1 ? 'Toggle Theme' : 'Journal'}
            >
            <FontAwesomeIcon
            key={index}
             icon={icon} className={`${index == 0 ? 'text-yellow-400 text-shadow-2xs':'text-blue-400 shadow-2xl'}`} 
              onClick={() => {
                if(onTrailingPressed){
                    onTrailingPressed(index);
                }
            }}/>
            </div>
        ))}
        </div>
    </div>
}
export default AppBar;


