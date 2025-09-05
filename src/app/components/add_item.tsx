import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useWatch } from "../hooks/page_index"
import { ThemeColor } from "../static/colors"
import { imgIcon } from "../static/styles"
import SizedBox from "../hooks/SizedBox"
import Button from "@mui/material/Button"
import { CSSProperties } from "@mui/material"

interface itemProps{
    title:string
    name:string
    image: `/${string}`
    callback?: () => void
    viewText?:string
    viewCallBack?: () => void
    style?:CSSProperties
}

const AddComponent:React.FC<itemProps> = ({name, callback, title, image, viewText, viewCallBack, style}) => {
    const {darkMode} = useWatch();
    return (
        <div className="w-full rounded-3xl h-44 shadow relative flex justify-center items-center flex-col" style={{
                      backgroundColor: darkMode ? ThemeColor.darkMode : '',
                      boxShadow: darkMode ? ThemeColor.darkShadow!.heavy : '',
                      borderLeft: darkMode ? `2px solid yellow`:'',
                      borderRadius: darkMode ? '8px': '1rem',
                        ...style
                     }}>
                        <div
                             className="flex justify-center items-center gap-2 ml-2 absolute top-2 left-2 p-1 pr-2 shadow-xl" style={{
                                borderBottomRightRadius:'20px',
                                backgroundColor: darkMode ? ThemeColor.dark : ''
                             }}>
                                <img src={image} style={{...imgIcon}} />
                                <p className="text-blue-300 text-sm">{title}</p>
                        </div>
        <div className="h-20 flex flex-col justify-center items-center w-full gap-3.5 opacity-40" onClick={() =>{if(callback) callback()}}>
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
        }}>{`Click to add ${name}`}</p>
        <SizedBox height={10}/>
                {/* Button */}
                <Button variant={
                  darkMode ? 'text':'text'
                  } className="absolute -bottom-2" color={darkMode ? 'inherit':'inherit'} style={{color:darkMode ? 'white':ThemeColor.primary}} onClick={() => {if(viewCallBack) viewCallBack()}}>{viewText || 'No text'}</Button>
    </div>
    </div>
    )
}
export default AddComponent;