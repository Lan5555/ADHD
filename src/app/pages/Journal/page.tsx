'use client';

import ListTile from "@/app/components/ListTile";
import { useWatch } from "@/app/hooks/page_index";
import { ThemeColor } from "@/app/static/colors";
import { db } from "@/app/static/firebase";
import { faBackspace, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CircularProgress, Fab } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Journal {
  title?: string;
  content: string;
  date: string;
  [key: string]: any;
}

const JournalPage: React.FC = () => {
  const { userId, darkMode, setShowJournalMain, showJournalMain } = useWatch();
  const [journals, setJournals] = useState<{ id: string; data: Journal }[]>([]);
  const [displayIndex, setDisplayIndex] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJournals = async () => {
      if (!userId) return;

      try {
        const dataRef = doc(db, 'journals', userId);
        const docSnap = await getDoc(dataRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.journals) {
            const journalEntries = Object.entries(data.journals).map(
              ([id, journal]) => ({
                id,
                data: journal as Journal,
              })
            );

            setJournals(journalEntries);
          }
        } else {
          console.warn("No document found for user:", userId);
        }
      } catch (error) {
        console.error("Error fetching journals:", error);
      }
    };

    fetchJournals();
  }, [userId]);

  const displayJournal = () => {
    if (displayIndex === null) return null;

    const journal = journals[displayIndex];
    return (
      <div
        key={journal.id}
        className="rounded h-auto w-full flex flex-col gap-5 p-4 mb-3"
        style={{
          boxShadow: darkMode
            ? ThemeColor.darkShadow!.heavy
            : '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          className="font-bold text-xl"
          style={{ color: darkMode ? 'white' : 'black' }}
        >
          {journal.data.title || 'Untitled'}
        </h2>
        <p style={{ color: darkMode ? 'white' : 'black' }}>
          {journal.data.content}
        </p>

        <Fab
          sx={{
            position: 'absolute',
            bottom: '20px',
            right: '10px',
          }}
          variant="extended"
          onClick={() => {
            setShowJournalMain(false);
            setDisplayIndex(null);
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          &nbsp;Back
        </Fab>
      </div>
    );
  };

  return !showJournalMain ? (
    <div
      className="p-4"
      style={{
        maxHeight: '80vh',
        overflowY: 'auto',
        backgroundColor: darkMode ? '#121212' : 'white',
        color: darkMode ? 'white' : 'black',
      }}
    >
      <h2 className="text-2xl font-bold mb-4">My Journals</h2>

      {journals.length === 0 ? (
        <div className="flex justify-center items-center gap-2">
        <p>No journals found yet. Searching....</p>
        <CircularProgress size={20} sx={{ color: darkMode ? 'white' : 'black' }} />
        </div>
      ) : (
        journals.map((journal, index) => (
          <div
            key={journal.id}
            className="rounded h-auto w-full mb-3"
            style={{
              boxShadow: darkMode
                ? ThemeColor.darkShadow!.heavy
                : '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            onClick={() => {
              setDisplayIndex(index);
              setShowJournalMain(true);
            }}
          >
            <ListTile
              type="trail"
              title={journal.data.title || 'Untitled'}
              titleStyle={{
                fontSize: '12pt',
                fontWeight: 'bold',
                color: darkMode ? 'black' : '#333',
              }}
              subtitle={
                journal.data.date
                  ? new Date(journal.data.date).toLocaleDateString()
                  : 'No Date'
              }
              subtitleStyle={{
                fontSize: '8pt',
                color: darkMode ? 'black' : '#666',
              }}
              trailing={null}
              leading={
                <img
                  src="/list.png"
                  alt="Journal"
                  className="w-14 h-14"
                />
              }
            />
          </div>
        ))
      )}

      <Fab
        sx={{
          position: 'absolute',
          bottom: '20px',
          right: '10px',
        }}
        variant="extended"
        onClick={() => {
          router.push('/pages/Home');
        }}
      >
        <FontAwesomeIcon icon={faSignOutAlt} />
        &nbsp;Back
      </Fab>
    </div>
  ) : (
    <div
      className="p-4"
      style={{
        maxHeight: '80vh',
        overflowY: 'auto',
        backgroundColor: darkMode ? '#121212' : 'white',
        color: darkMode ? 'white' : 'black',
      }}
    >
      {displayJournal()}
    </div>
  );
};

export default JournalPage;
