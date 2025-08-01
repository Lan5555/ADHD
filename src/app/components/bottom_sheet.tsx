import { CSSProperties } from "@mui/material"
import { JSX, ReactNode, useEffect, useRef, useState } from "react";

interface sheetProps{
    children?:ReactNode,
    style?:CSSProperties,
    heightValue?:string,
    className?:string,
    onClose?:() => void
}

const ShowBottomSheet = ({children, heightValue, style, className, onClose}:sheetProps):JSX.Element => {
    const [state, setState] = useState<boolean>(true);
    useEffect(() => {
        if(onClose){
            onClose();
        }
    },[state]);
        return (
        <div 
            className={`w-full h-[40vh] shadow bg-amber-100 fixed bottom-0 slide-in-bottom ${className}`} style={{
            height:heightValue,
            borderTopLeftRadius:'30px',
            borderTopRightRadius:'30px',
            ...style
        }}>
            <div className="w-20 h-1 bg-black m-auto" style={{
                borderTopLeftRadius:'20px',
                borderTopRightRadius:'20px'
            }} onClick={() => {
                setState(prev => !prev);
            }}></div>
            {children}
        </div>
        );
}

export default ShowBottomSheet;