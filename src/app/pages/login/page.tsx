'use client';
import { useWatch } from "@/app/hooks/page_index";
import Register from "./register";
import LoginPage from "./login";
import MobileLayout from "@/app/layouts/mobile/page";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { ThemeColor } from "@/app/static/colors";

const RenderSignUp: React.FC = () => {
  const { IsSignUpVisible, ActivePageIndex, userId, isAuthReady } = useWatch();


  if (!isAuthReady) {
    return (
      <div className="flex justify-center items-center h-screen flex-col gap-2 animate-pulse" style={{
        backgroundColor:ThemeColor.primary
      }}>

        <CircularProgress sx={{
          color:'white'
        }} />
        <h2 className="text-white text-sm">Retrieving previous state!</h2>
      </div>
    );
  }

  if (ActivePageIndex === 0 && userId == null) {
    return IsSignUpVisible ? <Register /> : <LoginPage />;
  }
   else if (userId != null) {
    return <MobileLayout />; // ✅ FIXED: return added
  } else {
    return <LoginPage />;
  }
};

export default RenderSignUp;
