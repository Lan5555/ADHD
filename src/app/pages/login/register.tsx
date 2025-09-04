'use client';
import { UseFirebase } from "@/app/hooks/firebase_hooks";
import { useWatch } from "@/app/hooks/page_index";
import { faEnvelope, faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress, TextField, InputAdornment, IconButton, Box, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Register: React.FC = () => {
  const {
    toggleSignUp, setActivePageIndex, setOpen, setSnackSeverity, setSnackText, darkMode
  } = useWatch();

  const { SignUp, SignInWithGoogle, addData } = UseFirebase();

  const [email, setUserEmail] = useState('');
  const [password, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setOpen(true);
      setSnackText('Passwords don\'t match');
      setSnackSeverity('warning');
      return;
    }

    setLoading(true);
    try {
      const data = await SignUp({ email, password });

      if (data.success) {
        setOpen(true);
        setSnackText('Registered successfully');
        setSnackSeverity('success');

        const user = data.data;

        const saveResult = await addData(`users/${user.uid}`, {
          userId: user.uid,
          name: userName,
          email: user.email,
        });

        setActivePageIndex(1);

        if (saveResult.error) {
          toast.warning(saveResult.error);
        }

      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      setOpen(true);
      setSnackText('Oops something went wrong!');
      setSnackSeverity('warning');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    try {
      const data = await SignInWithGoogle();

      if (data.success && data.data) {
        setOpen(true);
        setSnackText('Registered successfully');
        setSnackSeverity('success');

        const user = data.data;

        const saveResult = await addData(`users/${user.uid}`, {
          userId: user.uid,
          name: user.displayName || userName,
          email: user.email,
        });

        setActivePageIndex(1);

        if (saveResult.error) {
          toast.warning(saveResult.error);
        }
      } else {
        setOpen(true);
        setSnackText('Sign in error');
        setSnackSeverity('warning');
      }
    } catch (err) {
      console.error(err);
      setOpen(true);
      setSnackText('Oops something went wrong');
      setSnackSeverity('warning');
    } finally {
      setLoading(false);
    }
  };

  // Define colors depending on darkMode
  const bgColor = darkMode ? '#121212' : '#f9f9f9';
  const formBgColor = darkMode ? '#1e1e1e' : '#fff';
  const textColor = darkMode ? '#e0e0e0' : '#222';
  const buttonBgColor = darkMode ? '#333' : 'black';
  const buttonHoverColor = darkMode ? '#555' : '#333';

  return (
    <Box
      className="w-full min-h-screen flex justify-center items-center p-4"
      sx={{ backgroundColor: bgColor }}
    >
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 shadow-xl rounded-xl flex flex-col gap-5"
        style={{ backgroundColor: formBgColor }}
      >
        <Typography
          variant="h4"
          className="text-center font-semibold"
          style={{ color: textColor }}
        >
          Create an Account
        </Typography>

        {/* Username */}
        <TextField
          fullWidth
          required
          label="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faUser} style={{ color: textColor }} />
              </InputAdornment>
            ),
          }}
          sx={{
            input: { color: textColor },
            label: { color: textColor },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: darkMode ? '#444' : '#ccc' },
              '&:hover fieldset': { borderColor: darkMode ? '#666' : '#888' },
              '&.Mui-focused fieldset': { borderColor: buttonBgColor },
            },
          }}
        />

        {/* Email */}
        <TextField
          fullWidth
          required
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setUserEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faEnvelope} style={{ color: textColor }} />
              </InputAdornment>
            ),
          }}
          sx={{
            input: { color: textColor },
            label: { color: textColor },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: darkMode ? '#444' : '#ccc' },
              '&:hover fieldset': { borderColor: darkMode ? '#666' : '#888' },
              '&.Mui-focused fieldset': { borderColor: buttonBgColor },
            },
          }}
        />

        {/* Password */}
        <TextField
          fullWidth
          required
          label="Password"
          type={passwordVisible ? 'text' : 'password'}
          value={password}
          onChange={(e) => setUserPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faUser} style={{ color: textColor }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setPasswordVisible(prev => !prev)} sx={{ color: textColor }}>
                  <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            input: { color: textColor },
            label: { color: textColor },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: darkMode ? '#444' : '#ccc' },
              '&:hover fieldset': { borderColor: darkMode ? '#666' : '#888' },
              '&.Mui-focused fieldset': { borderColor: buttonBgColor },
            },
          }}
        />

        {/* Confirm Password */}
        <TextField
          fullWidth
          required
          label="Confirm Password"
          type={passwordVisible ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faUser} style={{ color: textColor }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setPasswordVisible(prev => !prev)} sx={{ color: textColor }}>
                  <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            input: { color: textColor },
            label: { color: textColor },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: darkMode ? '#444' : '#ccc' },
              '&:hover fieldset': { borderColor: darkMode ? '#666' : '#888' },
              '&.Mui-focused fieldset': { borderColor: buttonBgColor },
            },
          }}
        />

        {/* Submit Button */}
        <Button
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{
            backgroundColor: buttonBgColor,
            color: 'white',
            '&:hover': {
              backgroundColor: buttonHoverColor
            }
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
        </Button>

        {/* Switch to login */}
        <Box className="text-center">
          <Typography
            variant="body2"
            style={{ color: textColor }}
          >
            Already have an account?{' '}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => toggleSignUp((prev: any) => !prev)}
            >
              Log in
            </span>
          </Typography>
        </Box>

        {/* Divider with Google sign in */}
        <Box className="flex justify-center items-center gap-3 mt-2">
          <Typography
            variant="body2"
            style={{ color: textColor }}
          >
            or sign in with
          </Typography>
          <img
            src="/google.png"
            alt="Google"
            className="h-6 w-6 cursor-pointer"
            onClick={handleSignInWithGoogle}
          />
        </Box>
      </motion.form>
    </Box>
  );
};

export default Register;
