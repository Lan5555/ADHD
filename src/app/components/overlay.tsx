'use client'
import { useWatch } from "../hooks/page_index";
interface prop{
    style?:React.CSSProperties,
}

const Overlay:React.FC<prop> = ({style}) => {
    const {isOverlayShown} = useWatch()
    return  <>
        {isOverlayShown && <div className="w-full h-screen fixed top-0 bottom-0 left-0 right-0 fade-in z-50" style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            ...style
        }}></div>}
    </>
}
export default Overlay;