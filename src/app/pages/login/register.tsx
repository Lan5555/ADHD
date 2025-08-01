import { UseFirebase } from "@/app/hooks/firebase_hooks";
import { useWatch } from "@/app/hooks/page_index";
import { faEnvelope, faEye, faEyeSlash, faGlobe, faPerson, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, CircularProgress } from "@mui/material";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const Register:React.FC = () => {
    const {toggleSignUp,setActivePageIndex, isToolBarShown,setToolBarShown} = useWatch();
    const {SignUp,SignInWithGoogle,addData} = UseFirebase();
    const [email, setUserEmail] = useState<string>('');
    const [password, setUserPassword] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [confirmPassword,setConfirmPaswword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [userId,setUserId] = useState<string>('');


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    toast.warning('Passwords dont match');
    return;
  }

  setLoading(true);
  try {
    const data = await SignUp({ email, password });

    if (data.success) {
      toast.success('Registered Successfully');

      const user = data.data; 

      const saveResult = await addData(`users/${user.uid}`, {
        userId:user.uid,
        name:userName,
        email:user.email,
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
    toast.warning('Something went wrong');
  } finally {
    setLoading(false);
  }
};


  const handleSignInWithGoogle = async () => {
  setLoading(true);
  try {
    const data = await SignInWithGoogle();

    if (data.success && data.data) {
      toast.success('User Registered');

      const user = data.data;

      const saveResult = await addData(`users/${user.uid}`, {
        userId: user.uid,
        name: user.displayName || userName, // fallback to userName if displayName is missing
        email: user.email,
      });
      setActivePageIndex(1);

      if (saveResult.error) {
        toast.warning(saveResult.error);
      }
    } else {
      toast.error(data.error || 'Google sign-in failed');
    }
  } catch (err) {
    console.error(err);
    toast.error('Something went wrong during Google sign-in');
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
        <form className="w-[90%] h-[85vh] backdrop-blur-sm rounded-2xl shadow flex justify-center items-center gap-10 flex-col relative" onSubmit={(e) => handleSubmit(e)}>
         <h1 className="text-black text-3xl font-serif animate-pulse">Register</h1>
         <div className="flex justify-center items-center shadow p-1 relative w-[90%]">
          <FontAwesomeIcon icon={faUser} style={{
            height:'20px',
            width:'20px'
          }} className="absolute left-2"/>
         <input className="bg-none p-2 pl-2 w-[80%] outline-none text-sm" placeholder="User name" onChange={(val) => setUserName(val.target.value)} required></input>
         </div>
         {/* Mail */}
          <div className="flex justify-center items-center shadow p-1 relative w-[90%]">
          <FontAwesomeIcon icon={faEnvelope} style={{
            height:'20px',
            width:'20px'
          }} className="absolute left-2"/>
         <input type="email" className="bg-none p-2 pl-2 w-[80%] outline-none text-sm" placeholder="Email" onChange={(val) => setUserEmail(val.target.value)} required></input>
         </div>
        <div className="flex justify-center items-center shadow p-1 relative w-[90%]">
          <FontAwesomeIcon icon={faUser} style={{
            height:'20px',
            width:'20px'
          }} className="absolute left-2"/>
         <input type= {passwordVisible ? 'text':"password"} className="bg-none p-2 pl-2 w-[80%] outline-none text-sm" placeholder="Password" onChange={(val) => setUserPassword(val.target.value)} required></input>
         <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} className="absolute right-2" style={{
            height:'20px',
            width:'20px'
         }} onClick={() => setPasswordVisible(prev => !prev)}/>
         </div>
          <div className="flex justify-center items-center shadow p-1 relative w-[90%]">
          <FontAwesomeIcon icon={faUser} style={{
            height:'30px',
            width:'20px'
          }} className="absolute left-2" />
         <input type={passwordVisible ? 'text':"password"} className="bg-none p-2 pl-2 w-[80%] outline-none text-sm" placeholder="Confirm password" onChange={(val) => setConfirmPaswword(val.target.value)} required></input>
         <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} className="absolute right-2" style={{
            height:'30px',
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
            }}/> : 'Sign Up'}
         </Button>
         <div className="flex justify-center items-center gap-2">
            <p className="text-sm">Already have an account?</p>
            <a className="text-blue-600 text-sm" onClick={() => toggleSignUp((prev: any) => !prev)}>Log in</a>
         </div>
         <div className="flex justify-center items-center gap-2">
            <p className="text-sm">Or</p>
          <p className="text-sm">Sign in with</p><img src={'/google.png'} style={{
            height:'20px',
            width:'20px'
          }} onClick={() => handleSignInWithGoogle()}/>
         </div>
        </form>
        </div>
    );
}

export default Register;