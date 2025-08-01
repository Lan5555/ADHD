import Overlay from "@/app/components/overlay";
import { WatchProvider } from "@/app/hooks/page_index";
import RenderSignUp from "../login/page";
import {ToastContainer} from 'react-toastify';
import MobileLayout from "@/app/layouts/mobile/page";

const HomePage:React.FC = () => {
    return <>
        <WatchProvider>
            <RenderSignUp/>
            {/* <MobileLayout/> */}
            <ToastContainer/>
        </WatchProvider>
    </>
}

export default HomePage;


