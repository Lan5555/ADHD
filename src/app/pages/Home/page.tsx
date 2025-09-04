'use client';

import { useWatch } from "@/app/hooks/page_index";
import RenderSignUp from  "@/app/pages/login/page";
import { ToastContainer } from 'react-toastify';
import ShowMaterialSnackbar from "@/app/components/snackbar";
import { useMediaQuery } from 'react-responsive';
import { useEffect, useState } from "react";

const HomePage: React.FC = () => {
  const { snackText, darkMode } = useWatch();

  // 🔁 Hydration state to avoid mismatches between SSR and client
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Only run media queries after hydration
  const isMobile = useMediaQuery({ maxWidth: 600 });

  if (!hydrated) {
    return null; // or a spinner
  }

  const unsupportedMessage = (
    <div
      className="w-full h-screen flex justify-center items-center flex-col gap-2 animate-pulse"
      style={{ backgroundColor: darkMode ? 'black' : 'white' }}
    >
      <img
        src="/check.gif"
        style={{ height: '250px', width: '300px' }}
        alt="Unsupported"
      />
      <h2 style={{ color: darkMode ? 'white' : 'black' }}>
        This app isn't available for this device!
        <br />
        Please switch to Mobile!
      </h2>
    </div>
  );

  return (
    <>
      {isMobile ? <RenderSignUp /> : unsupportedMessage}

      <ToastContainer />
      <ShowMaterialSnackbar
        text={snackText || 'Some text'}
        duration={3000}
        anchor={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      />
    </>
  );
};

export default HomePage;
