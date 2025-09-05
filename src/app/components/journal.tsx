import { faBold, faClose, faEthernet, faItalic, faR, faRedo, faUnderline } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addDoc, doc, setDoc } from "firebase/firestore";
import { useRef } from "react";
import { db } from "../static/firebase";
import { useWatch } from "../hooks/page_index";
import motion from 'framer-motion';

const Journal:React.FC = () => {
    const {userId, setShowJournal, setOpen, setSnackSeverity,setSnackText} = useWatch()
    const textRef = useRef<HTMLTextAreaElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="flex justify-center items-center h-[60] w-full p-2 fixed top-0 left-0 z-40">
             <form className="w-full h-[90vh] flex justify-center rounded shadow bg-white p-1 font-bold flex-col gap-2 relative" onSubmit={async(e) => {
                e.preventDefault();
                if(!userId) return;
                    // Save to Firestore
                    const dataRef = doc(db,'journals',userId!);
                    const key = Date.now(); // unique key based on timestamp
                    const data = {
                        journals: {
                            [key]: {
                                title: inputRef.current?.value,
                                content: textRef.current?.value,
                                date: new Date().toISOString()
                            }
                        }
                    }
                    setShowJournal(false);
                    await setDoc(dataRef, data, {merge:true}).then(() => {
                         if(!inputRef.current?.value || !textRef.current?.value) return;
                         inputRef.current.value = '';
                         textRef.current.value = '';
                         
                    });
                    setOpen(true);
                    setSnackText('Journal Saved!');
                    setSnackSeverity('success');
                    
             }}>
            <FontAwesomeIcon icon={faClose} className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer" onClick={() => setShowJournal(false)}/>
            <FontAwesomeIcon icon={faEthernet} className="absolute top-4 right-13 text-gray-500 hover:text-black cursor-pointer" onClick={() => {
                textRef.current?.blur();
                inputRef.current?.blur();
            }}/>
            <h2 className="text-center" style={{
                background: 'linear-gradient(90deg, #ff8a00, #e52e71)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>Write</h2>
            <input ref={inputRef} type="text" className="w-full p-2 outline-none border-none rounded" placeholder="Title" required/>
            <textarea ref={textRef} className="w-full h-full p-2 outline-none border-none rounded" placeholder="Write your thoughts here..." required></textarea>
            <div className="w-full flex justify-between items-center gap-2">
                <div className="flex gap-5 ml-4">
                    <FontAwesomeIcon icon={faBold} className="text-gray-500 hover:text-black cursor-pointer" onClick={() => {
                        if (!textRef.current) return
                        textRef.current.style.fontWeight = textRef.current?.style.fontWeight === 'bold' ? 'normal' : 'bold';
                    }}/>
                    <FontAwesomeIcon icon={faItalic} className="text-gray-500 hover:text-black cursor-pointer" onClick={() => {
                        if (!textRef.current) return
                        textRef.current.style.fontStyle = textRef.current?.style.fontStyle === 'italic' ? 'normal' : 'italic';
                    }}/>
                    <FontAwesomeIcon icon={faUnderline} className="text-gray-500 hover:text-black cursor-pointer" onClick={() => {
                        if (!textRef.current) return
                        textRef.current.style.textDecoration = textRef.current?.style.textDecoration === 'underline' ? 'none' : 'underline';
                    }}/>
                    <FontAwesomeIcon icon={faRedo} className="text-gray-500 hover:text-black cursor-pointer" onClick={() => {
                        if (!textRef.current) return
                        textRef.current.value = '';
                        textRef.current.style.fontWeight = 'normal';
                        textRef.current.style.fontStyle = 'normal';
                        textRef.current.style.textDecoration = 'none';
                    }}/>
                </div>
                <div className="flex gap-2">
                 <button type="submit" className="px-4 py-1 rounded bg-blue-500 text-white font-bold">Save</button>
                
                </div>
            </div>
            </form>
        </div>
       
    )
}
export default Journal;