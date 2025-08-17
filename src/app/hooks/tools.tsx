import { CSSProperties } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { useWatch } from "./page_index";

interface DestroyProps {
    children: ReactNode;
    delay?: number; // optional delay in ms,
    style?:CSSProperties
    className:string
}

const Destroy: React.FC<DestroyProps> = ({ children, delay = 1000, style, className }) => {
    const {isVisible,setIsVisible} = useWatch();
    const val = delay * 1000;
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, val);

        return () => clearTimeout(timer);
    }, [delay]);

    return isVisible ? <div style={{...style}} className={className}>{children}</div> : null;
};

export default Destroy;