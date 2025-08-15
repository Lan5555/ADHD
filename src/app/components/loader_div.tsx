import { useEffect, useRef } from "react";
import { float } from "../hooks/SizedBox";

interface LoaderProps {
    width?: string;
    height?: string;
    color?: string;
    text?: string;
    textColor?: string;
    progressWidth?: string;
    type?: "circle" | "bar";
}
const Progress:React.FC<LoaderProps> = ({width,height,color,text,textColor,progressWidth,type}) => {
    const progressRef = useRef<HTMLDivElement>(null);
    // Set the initial width of the progress bar
    useEffect(() => {
        progressRef.current!.style.width = `${progressWidth}%`;
    },[progressWidth]);

    function CircleLoader(){
        return(
          <div>
            
          </div>  
        );
    }


    return (
        <div className="flex justify-start items-center rounded-2xl shadow relative" style={{width: width ?? '100%', height: height ?? '100%'}}>
            <div
            ref={progressRef}
             style={{
                width: progressWidth ?? '100%',
                height: '100%',
                borderRadius: '10px',
                transition: 'width 0.5s ease',
                backgroundColor: color ?? 'white',
            }} className="flex justify-end items-center">
                <span style={{color: textColor ?? 'black'}} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[8pt]">{text}%</span>
            </div>
        </div>
    );
}
export default Progress;