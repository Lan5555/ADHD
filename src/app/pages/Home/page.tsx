'use client'
import Overlay from "@/app/components/overlay";
import { useWatch, WatchProvider } from "@/app/hooks/page_index";
import RenderSignUp from "../login/page";
import {ToastContainer} from 'react-toastify';
import MobileLayout from "@/app/layouts/mobile/page";
import ShowMaterialSnackbar from "@/app/components/snackbar";

const HomePage:React.FC = () => {
    const {snackText} = useWatch();
    return <>
            
            <RenderSignUp/>
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


