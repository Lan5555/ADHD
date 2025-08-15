'use client'
import { CSSProperties, useEffect, useRef } from "react";
import { float } from "../hooks/SizedBox";

interface props{
    content:React.ReactNode;
    colorValue:CSSProperties['backgroundColor'];
    margin?:'Left'|'Right',
    marginValue?:number,
    height?:string
    width?:float
}
const Wrap:React.FC<props> = ({content,colorValue,margin,marginValue, height, width}) => {
    const divRef = useRef<HTMLDivElement>(null);
   useEffect(() => {
  if (divRef.current) {
    if (margin === 'Left') {
      divRef.current.style.marginLeft = `${marginValue ?? 0}px`;
    } else if (margin === 'Right') {
      divRef.current.style.marginRight = `${marginValue ?? 0}px`;
    }
  }
1}, [margin, marginValue]);


    return <div
        ref={divRef}
        className="rounded flex justify-center items-center" style={{
        backgroundColor:colorValue,
        boxSizing:'border-box',
        padding:'5px',
        height: height ?? '20px',
        width: `${width}px`
        
    }}>{content}</div>
}
export default Wrap;