import { NextJsHotReloaderInterface } from "next/dist/server/dev/hot-reloader-types"
import { useState } from "react";
import { useWatch } from "../hooks/page_index";
import SizedBox from "../hooks/SizedBox";

interface ToolKit{
    type: 'question' | 'confirmation',
    position?:'top' | 'bottom' | 'left' | 'right',
    style?: React.CSSProperties,
    content: React.ReactNode,
    onPressed?: (index: number) => void;
    onConfirm?: () => void;
}


const ToolBar:React.FC<ToolKit> = ({type,position,style,content, onPressed, onConfirm}) => {
    const {isToolBarShown} = useWatch();
    return <>
    {type ==='question' && isToolBarShown ? (<div className="flex justify-center items-center p-3 flex-col w-80 h-[300px] rounded-4xl shadow relative pop-up" style={{
        position:'fixed',
        backgroundColor:'white',
         zIndex: 70,
        ...style,
    }}>
        {content}
    <div className="w-full p-2 flex justify-evenly items-center absolute bottom-0" style={{
        borderTop:'1px solid rgba(0,0,0,0.1)',
        ...style,
    }}>
        {Array.from({length:2}).map((_,index) => (
            <div
            key={index}
            onClick={() => {
                if(onPressed){
                    onPressed(index);
                }
            }}
            style={{
                borderRight: index === 0 ? '1px solid rgba(0,0,0,0.2)' : '',
                width: index === 0 ? '30%':'',
                color: index === 0 ? 'green' : 'red'
            }}>
            {index === 0 ? 'Yes' : 'No'}
            </div>
        ))}
        
    </div>
    </div>)
    : type === 'confirmation' && isToolBarShown ? (<div className="flex justify-center items-center p-3 flex-col w-80 h-[300px] shadow relative pop-up rounded-4xl" style={{
        position:'fixed',
        backgroundColor:'white',
        zIndex: 70,
    }}>
        {content}

        <div className="w-full p-2 flex justify-center items-center absolute bottom-0" style={{
        borderTop:'1px solid rgba(0,0,0,0.2)'
    }}
    onClick={() => {
        if(onConfirm){
            onConfirm()
        }
    }}
    >
        OK
    </div>
    </div>) :
    null
    }
    </>
   
}

export default ToolBar;