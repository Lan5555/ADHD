'use client';

import { useWatch } from "@/app/hooks/page_index";
import Register from "./register";
import LoginPage from "./login";
import MobileLayout from "@/app/layouts/mobile/page";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { ThemeColor } from "@/app/static/colors";

const RenderSignUp: React.FC = () => {
  const { IsSignUpVisible, ActivePageIndex, userId, isAuthReady } = useWatch();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // 1. Wait for hydration
  if (!hydrated) {
    return null;
  }

  // 2. Show loading state if auth is not ready yet
  if (!isAuthReady) {
    return (
      <div
        className="flex justify-center items-center h-screen flex-col gap-2 animate-pulse"
        style={{ backgroundColor: ThemeColor.primary }}
      >
        <CircularProgress sx={{ color: "white" }} />
        <h2 className="text-white text-sm">Retrieving previous state!</h2>
      </div>
    );
  }

  // 3. Show register/login if no user is logged in
  if (ActivePageIndex === 0 && userId == null) {
    return IsSignUpVisible ? <Register /> : <LoginPage />;
  }

  // 4. If user is logged in, show the app
  if (userId != null) {
    return <MobileLayout />;
  }

  // 5. Fallback (unauthenticated default)
  return <LoginPage />;
};

export default RenderSignUp;
