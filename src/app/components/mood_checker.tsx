import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../static/firebase";
import { useWatch } from "../hooks/page_index";

interface Props {
  emojis: string[];
  text: string;
}

const MoodChecker: React.FC<Props> = ({ emojis, text }) => {
  const {
    darkMode,
    userId,
    setOpen,
    showOverlay,
    setSnackSeverity,
    setSnackText,
    mounted,
    setMounted,
  } = useWatch();

  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const checkMood = async (emoji: string) => {
    if (!userId || loading) return;
    setLoading(true);
    try {
      const dataRef = doc(db, "moodChecks", userId);
      const data = {
        lastMood: {
          emoji,
          timestamp: new Date().toISOString(),
        },
      };
      await setDoc(dataRef, data, { merge: true });
      setSelectedEmoji(emoji);
      setOpen(true);
      setSnackText("Mood Updated!");
      setSnackSeverity("success");
      // Delay unmount for smooth UX
      setTimeout(() => setMounted(false), 500);
    } catch (e) {
      console.error("Mood update error:", e);
      setOpen(true);
      setSnackText("Error updating mood");
      setSnackSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="w-auto h-auto flex flex-col justify-center items-center gap-5 shadow rounded p-4 pop-up"
          style={{
            boxShadow: darkMode
              ? "0 4px 6px rgba(0, 0, 0, 0.9)"
              : "0 4px 6px rgba(0, 0, 0, 0.1)",
            backgroundColor: darkMode ? "#1e1e1e" : "white",
            position: "fixed",
            zIndex: 50,
          }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: darkMode ? "white" : "black" }}
          >
            {text}
          </h2>

          <div className="w-full flex justify-center items-center gap-5">
            {emojis.map((emoji, index) => (
              <div
                key={index}
                role="button"
                aria-label={`Mood ${emoji}`}
                tabIndex={0}
                className={`text-4xl cursor-pointer transition-transform duration-200 ${
                  selectedEmoji === emoji ? "transform scale-125" : ""
                }`}
                onClick={() => !loading && checkMood(emoji)}
                onKeyDown={(e) => {
                  if (!loading && e.key === "Enter") checkMood(emoji);
                }}
                style={{
                  filter:
                    selectedEmoji === emoji
                      ? "drop-shadow(0 0 5px gold)"
                      : "none",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MoodChecker;
