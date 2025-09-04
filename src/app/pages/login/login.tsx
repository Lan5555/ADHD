'use client';

import ToolBar from "@/app/components/toolkit";
import { UseFirebase } from "@/app/hooks/firebase_hooks";
import { useWatch } from "@/app/hooks/page_index";
import { db } from "@/app/static/firebase";
import { faEnvelope, faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const {
    toggleSignUp,
    darkMode,
    setActivePageIndex,
    setCurrentUserId,
    setOpen,
    setSnackText,
    setSnackSeverity,
  } = useWatch();
  const { LogIn, SignInWithGoogle, addData } = UseFirebase();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setUserName] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await LogIn({ email, password });
      if (login.success) {
        setActivePageIndex(1);
        setOpen(true);
        setSnackText("Welcome!");
        setSnackSeverity("success");
      } else {
        setOpen(true);
        setSnackText("Failed to log in");
        setSnackSeverity("warning");
      }
    } catch {
      setOpen(true);
      setSnackText("Oops something went wrong");
      setSnackSeverity("warning");
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    try {
      const data = await SignInWithGoogle();
      if (data.success && data.data) {
        const user = data.data;
        const userRef = doc(db, `users/${user.uid}`);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const saveResult = await addData(`users/${user.uid}`, {
            userId: user.uid,
            name: user.displayName || "Current user",
            email: user.email,
          });

          if (saveResult.success) {
            setOpen(true);
            setSnackText("Success");
            setSnackSeverity("success");
          } else {
            setOpen(true);
            setSnackText("Failed to save user details");
            setSnackSeverity("warning");
          }
        } else {
          setOpen(true);
          setSnackText("Welcome back!");
          setSnackSeverity("success");
        }

        setActivePageIndex(1);
      } else {
        setOpen(true);
        setSnackText("Google signin failed: " + data.error);
        setSnackSeverity("warning");
      }
    } catch (err) {
      console.error(err);
      setOpen(true);
      setSnackText("Oops! Something went wrong");
      setSnackSeverity("warning");
    } finally {
      setLoading(false);
    }
  };

  const bgColor = darkMode ? "#1e1e1e" : "#ffffff";
  const borderColor = darkMode ? "#333" : "#ccc";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const inputBg = darkMode ? "#2c2c2c" : "#f7f7f7";
  const accent = darkMode ? "#f0c674" : "#4a90e2";

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center"
      style={{
        background: darkMode
          ? "linear-gradient(to right, #1e1e1e, #2a2a2a)"
          : "linear-gradient(to right, #f0f0f0, #ffffff)",
        color: textColor,
      }}
    >
      <motion.form
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-[90%] max-w-md rounded-2xl flex flex-col gap-6 p-8"
        style={{
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          boxShadow: darkMode
            ? "0 8px 24px rgba(0,0,0,0.7)"
            : "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <motion.h1
          className="text-3xl font-bold text-center"
          style={{ color: textColor }}
          variants={fadeIn}
          custom={0.1}
        >
          Welcome Back 👋
        </motion.h1>

        {/* Email */}
        <motion.div
          className="w-full flex items-center gap-2 px-3 py-2 rounded"
          style={{
            backgroundColor: inputBg,
            border: `1px solid ${borderColor}`,
          }}
          variants={fadeIn}
          custom={0.2}
        >
          <FontAwesomeIcon icon={faEnvelope} style={{ color: textColor }} />
          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              width: "100%",
              color: textColor,
              fontSize: "14px",
            }}
          />
        </motion.div>

        {/* Password */}
        <motion.div
          className="w-full flex items-center gap-2 px-3 py-2 rounded relative"
          style={{
            backgroundColor: inputBg,
            border: `1px solid ${borderColor}`,
          }}
          variants={fadeIn}
          custom={0.3}
        >
          <FontAwesomeIcon icon={faUser} style={{ color: textColor }} />
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              width: "100%",
              color: textColor,
              fontSize: "14px",
            }}
          />
          <FontAwesomeIcon
            icon={passwordVisible ? faEye : faEyeSlash}
            onClick={() => setPasswordVisible((prev) => !prev)}
            style={{
              position: "absolute",
              right: "10px",
              cursor: "pointer",
              color: textColor,
            }}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={fadeIn} custom={0.4} className="w-full">
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              backgroundColor: accent,
              color: darkMode ? "#000" : "#fff",
              "&:hover": {
                backgroundColor: darkMode ? "#ffde88" : "#5a9ced",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: darkMode ? "#000" : "#fff" }} />
            ) : (
              "Login"
            )}
          </Button>
        </motion.div>

        {/* Register Prompt */}
        <motion.div
          className="flex items-center justify-center gap-2 text-sm"
          variants={fadeIn}
          custom={0.5}
        >
          <p style={{ color: textColor }}>Don't have an account?</p>
          <a
            onClick={() => toggleSignUp((prev: any) => !prev)}
            style={{ color: accent, cursor: "pointer" }}
          >
            Register
          </a>
        </motion.div>

        {/* Google Sign-In */}
        <motion.div
          className="flex flex-col items-center gap-1 mt-2"
          variants={fadeIn}
          custom={0.6}
        >
          <p style={{ fontSize: "0.9rem" }}>Or sign in with</p>
          <motion.img
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            src="/google.png"
            alt="Google"
            style={{
              height: "30px",
              width: "30px",
              cursor: "pointer",
              filter: darkMode ? "invert(1)" : "none",
            }}
            onClick={handleSignInWithGoogle}
          />
        </motion.div>
      </motion.form>

      {/* Username Prompt Modal */}
      <ToolBar
        content={
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 style={{ color: textColor }}>Enter your username</h2>
            <input
              className="w-full p-2 rounded"
              style={{
                backgroundColor: inputBg,
                border: `1px solid ${borderColor}`,
                color: textColor,
              }}
              placeholder="Enter username"
              onChange={(e) => setUserName(e.target.value)}
            />
          </motion.div>
        }
        type={"question"}
      />
    </div>
  );
};

export default LoginPage;
