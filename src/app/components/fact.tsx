import { faClose, faLightbulb } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import SizedBox from "../hooks/SizedBox"
import { ThemeColor } from "../static/colors"
import { useState } from "react"
import { useWatch } from "../hooks/page_index"

interface prop{
    content:string
}
const Fact:React.FC<prop> = ({content}) => {
    const {isVisible, setIsVisible} = useWatch();
    return isVisible && (
        <div className="w-92 h-[40vh] relative flex justify-start items-center gap-2 flex-col rounded-4xl pop-up shadow-2xl" style={{
            boxShadow:ThemeColor.shadowLg,
            backgroundImage:'url(/blue.jpg)',
            backgroundPosition:'center',
            backgroundRepeat:'no-repeat',
            backgroundSize:'cover'
        }}>
            <div className="w-full h-full relative flex justify-center items-center rounded-3xl p-2" style={{
                backdropFilter:'blur(5px)'
            }}>
            <div className="rounded-full p-1 bg-black absolute right-3 top-3 w-8 h-8 flex justify-center items-center shadow">
                <FontAwesomeIcon icon={faClose} color="white" onClick={() => setIsVisible(false)}/>
            </div>
         <FontAwesomeIcon icon={faLightbulb} color="orange" className="absolute left-5 top-15 animate-bounce" style={{
            width:'30px',
            height:'30px'
         }}/>
         <h1 className="text-3xl text-orange-500 absolute top-24 left-5 font-serif">DID YOU<br></br>KNOW?</h1>
         <SizedBox height={10}/>
         <p className="whitespace-pre-line absolute top-44 left-5 max-w-[70%] break-words">{content}</p>
         <SizedBox height={10}/>
         <div className="absolute bottom-5 flex justify-between w-72">
            <p>Random fact</p>
            <img src={'/dart.png'} style={{
                height:'50px',
                width:'50x'
            }}/>
            </div>
         </div>
        </div>
    )
}
export default Fact;