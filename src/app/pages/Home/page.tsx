'use client'
import Overlay from "@/app/components/overlay";
import { useWatch, WatchProvider } from "@/app/hooks/page_index";
import RenderSignUp from "../login/page";
import {ToastContainer} from 'react-toastify';
import MobileLayout from "@/app/layouts/mobile/page";
import ShowMaterialSnackbar from "@/app/components/snackbar";
import {useMediaQuery} from 'react-responsive';



const HomePage:React.FC = () => {
    const {snackText} = useWatch();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
    const isDesktop = useMediaQuery({ minWidth: 1025 });
    const {darkMode} = useWatch();
    return <>
            
            {!isMobile ? <>
            <div className="w-full h-screen flex justify-center items-center flex-col gap-2 animate-pulse" style={{
                backgroundColor: darkMode ? 'black':'white'
            }}>
                <img src={'/3d-alarm.png'} style={{
                 height:'200px',
                 width:'200px'
                }}/>
                <h2 style={{
                    color:darkMode ? 'white':'black'
                }}>This app isn't available for this device!<br></br>Please Switch to Mobile!</h2>
            </div>
            </> : (<RenderSignUp/>)}
            {/* <MobileLayout/> */}
            <ToastContainer/>
            <ShowMaterialSnackbar
            text={snackText || 'Some text'}
            duration={3000}
            anchor={{
                vertical:'bottom',
                horizontal:'center'
            }}
            />
    </>
}

export default HomePage;


