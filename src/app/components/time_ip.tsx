import { ReactNode, useEffect, useRef } from "react";

interface timeup{
    children:ReactNode
}

const OverlayContent:React.FC<timeup> = ({children}) => {
    useEffect(() => {
        if(navigator.vibrate){
            navigator.vibrate(200);
        }
    },[]);
    return (
        <div 
            className="h-[90vh] w-full flex justify-center items-center fixed" style={{
            zIndex:200
        }}>
            {children}
        </div>
    );
}
export default OverlayContent;