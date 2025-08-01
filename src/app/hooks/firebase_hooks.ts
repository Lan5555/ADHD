import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
import { app, db, googleProvider } from '../static/firebase';
import { auth } from '../static/firebase';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { useState } from 'react';

interface firbaseprops{
    data?:any;
    success?:boolean;
    error?:boolean;
    
}

interface targetData{
    success?:boolean
    data?:any
    error?:string
}

export const UseFirebase = () => {
   
    const SignUp = async ({email,password}:{email:string, password:string}):Promise<firbaseprops> => {
       
        try{
            const  userDetails = await createUserWithEmailAndPassword(auth, email,password);
            return {
                data:userDetails.user,
                success:true
            }
            
        }catch(err:any){
            return {
                success:false,
                error: err.message || 'Failed to fetch data'
            }
        }
        
    }

    const LogIn = async ({email,password}:{email:string, password:string}):Promise<firbaseprops> => {
        try{
            const userData = await signInWithEmailAndPassword(auth,email,password);
            return{
                data:userData.user,
                success:true
            }
        }catch(err: any){
            return{
                success:false,
                error:err.message || 'Unable to retrieve user imformation'
            }
        }
    }

    const SignInWithGoogle = async (): Promise<firbaseprops> => {
        try{
            const result = await signInWithPopup(auth,googleProvider);
            return{
                success:true,
                data:result.user
            }
        }catch(err:any){
            return {
                success:false,
                error: err.message || 'Unable to Sign in with google'
            }
        }

    }

    const fetchDataByQuery = async (path:string,field:string,value:string) => {
        const q = query(collection(db,path),where(field, '==', value));
        const data = await getDocs(q);

        const results:any[] = [];
        data.forEach((snapshot) => {
            results.push({id:snapshot.id, ...snapshot.data()})
        });

        return results;
    }

    const fetchData = async (path:string, id:string):Promise<targetData> => {
        const docRef = doc(db,path,id);
        const result = await getDoc(docRef);
        if(result.exists()){
            return {
                data: result.data(),
                success: true
            }
        }else{
            return {
                success:false,
                error:'Unable to fetch data'
            }
        }
        
    }

    const addData = async (
  path: string,               // full path like "users/user123"
  data: Record<string, any>   // the data to save
): Promise<targetData> => {
  const docRef = doc(db, path); // correct use of Firestore doc path
  try {
    await setDoc(docRef, data);
    return {
      success: true,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Unable to save data",
    };
  }
};

const addOrUpdateUserData = async (
  collectionPath: string,
  userId: string,
  data: Record<string, any>
): Promise<targetData> => {
  try {
    const userDocRef = doc(db, collectionPath, userId);

    // Optional: Check if document exists (can skip if you want to overwrite always)
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      // Document exists, you can update or overwrite
      await setDoc(userDocRef, data, { merge: true }); // merge: true to update fields only
      return { success: true };
    } else {
      // Document doesn't exist, create new
      await setDoc(userDocRef, data);
      return { success: true };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to add/update user data',
    };
  }
};
   
    return {SignUp,LogIn,fetchDataByQuery,fetchData,addData, SignInWithGoogle, addOrUpdateUserData}
}

