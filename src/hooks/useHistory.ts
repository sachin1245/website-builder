import { useState, useCallback, useEffect } from "react";
import { Page } from "@/types/Element";

export const useHistory = (
  initialPages: Page[],
  updatePages: (newPages: Page[]) => void
) => {
  // State to store the history of page states
  const [history, setHistory] = useState<Page[][]>([initialPages]);
  // State to keep track of the current position in history
  const [historyIndex, setHistoryIndex] = useState(0);

  // Function to add a new state to the history
  const addToHistory = useCallback(
    (newPages: Page[]) => {
      setHistory((prevHistory) => {
        // Remove any future states if we're not at the end of the history
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        // Only add to history if the new state is different from the current state
        if (
          JSON.stringify(newHistory[newHistory.length - 1]) !==
          JSON.stringify(newPages)
        ) {
          newHistory.push(newPages);
          setHistoryIndex(newHistory.length - 1);
        }
        return newHistory;
      });
    },
    [historyIndex]
  );

  // Function to undo the last action
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prevIndex) => prevIndex - 1);
      updatePages(history[historyIndex - 1]);
    }
  }, [history, historyIndex, updatePages]);

  // Function to redo the last undone action
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
      updatePages(history[historyIndex + 1]);
    }
  }, [history, historyIndex, updatePages]);

  return {
    addToHistory,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
};
