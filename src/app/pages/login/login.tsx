import ToolBar from "@/app/components/toolkit";
import { UseFirebase } from "@/app/hooks/firebase_hooks";
import { useWatch } from "@/app/hooks/page_index";
import { auth, db } from "@/app/static/firebase";
import { faEnvelope, faEye, faEyeSlash, faGlobe, faPerson, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress } from "@mui/material";
import { unsubscribe } from "diagnostics_channel";
import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";


const LoginPage:React.FC = () => {
    const {toggleSignUp,setActivePageIndex,setCurrentUserId,setOpen,setSnackText,setSnackSeverity} = useWatch();
    const {LogIn,SignInWithGoogle,addData} = UseFirebase();
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const [passwordVisible,setPasswordVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [name, setUserName] = useState<string>('');


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try{
            const login = await LogIn({email:email,password:password});
            if(login.success){
                setActivePageIndex(1);
                setOpen(true);
                setSnackText('Welcome!');
                setSnackSeverity('success');
            }else{
                setOpen(true);
                setSnackText('Failed to log in');
                setSnackSeverity('warning');
            }
        }catch(e:any){
                setOpen(true);
                setSnackText('Oops something went wrong');
                setSnackSeverity('warning');
        }finally{
            setLoading(false);
        }
    }


const handleSignInWithGoogle = async () => {
  setLoading(true);

  try {
    const data = await SignInWithGoogle();

    if (data.success && data.data) {
      const user = data.data;
      const userRef = doc(db, `users/${user.uid}`);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // First time user — save to Firestore
        const saveResult = await addData(`users/${user.uid}`, {
          userId: user.uid,
          name: user.displayName || 'Current user',
          email: user.email,
        });

        if (saveResult.success) {
                setOpen(true);
                setSnackText('Success');
                setSnackSeverity('success');
        } else {
                setOpen(true);
                setSnackText('Failed to save user details');
                setSnackSeverity('warning');
        }
      } else {
        // Returning user
                setOpen(true);
                setSnackText('Welcome back!');
                setSnackSeverity('success');
      }

      // TODO: Redirect user to dashboard or home page here
      setActivePageIndex(1);

    } else {
                setOpen(true);
                setSnackText('Google signin failed');
                setSnackSeverity('warning');
    }
  } catch (err) {
    console.error(err);
    setOpen(true);
    setSnackText('Welcome!');
    setSnackSeverity('Oops something wrong');
  } finally {
    setLoading(false);
  }
};



    return (
        <div className="w-full h-screen flex justify-center items-center" style={{
            backgroundImage:"url('/white2.jpeg')",
            backgroundSize:'cover',
            backgroundPosition:'center',
            backgroundRepeat:'no-repeat',

        }}>
        <form className="w-[90%] h-[70vh] backdrop-blur-sm rounded-2xl shadow-2xl flex justify-center items-center gap-10 flex-col relative" onSubmit={(e) => handleSubmit(e)}>
         <h1 className="text-black text-3xl font-serif animate-pulse">Login</h1>
         <div className="flex justify-center items-center shadow p-1 relative w-[90%]">
          <FontAwesomeIcon icon={faEnvelope} style={{
            height:'20px',
            width:'20px'
          }} className="absolute left-2"/>
         <input type="email" className="bg-none p-2 pl-2 w-[80%] outline-none text-sm" placeholder="Email" onChange={(val) => setEmail(val.target.value)} required></input>
         </div>
        <div className="flex justify-center items-center shadow p-1 relative w-[90%]">
          <FontAwesomeIcon icon={faUser} style={{
            height:'20px',
            width:'20px'
          }} className="absolute left-2"/>
         <input type={passwordVisible ? "text" : 'password'} className="bg-none p-2 pl-2 w-[80%] outline-none text-sm" placeholder="password" onChange={(val) => setPassword(val.target.value)} required></input>
         <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} className="absolute right-2" style={{
            height:'20px',
            width:'20px'
         }} onClick={() => setPasswordVisible(prev => !prev)}/>
         </div>
         <Button variant={'contained'} sx={{
            width:'90%',
            backgroundColor:'antiquewhite',
            color:'black'
         }} type={'submit'}>
            {loading ? <CircularProgress color={'inherit'} sx={{
                color:'white'
            }}/> :'Login'}
         </Button>
         <div className="flex justify-center items-center gap-2">
            <p className="text-sm">Dont have an account?</p>
            <a className="text-blue-600 text-sm" onClick={() => toggleSignUp((prev: any) => !prev)}>Register</a>
         </div>
         <div className="flex justify-center items-center gap-2 flex-col relative -top-5">
            <p className="text-sm">Or</p>
          <p className="text-sm">Sign in with</p>
          <img src={'/google.png'} style={{
            height:'25px',
            width:'25px'
          }} onClick={() => handleSignInWithGoogle()} />
         </div>
        </form>
        <ToolBar content={
          <div className="flex justify-center items-center gap-2 flex-col">
            <h2>Enter your username</h2>
            <input className="w-full p-2 rounded" placeholder="Enter username" onChange={(e) => setUserName(e.target.value)}></input>
          </div>
        } type={'question'}/>
        </div>
    );
}

export default LoginPage;