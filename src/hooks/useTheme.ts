import { useState, useCallback } from "react";
import { Theme, lightTheme } from "@/styles/themes";

export const useTheme = () => {
  // State to store the current theme
  const [currentTheme, setCurrentTheme] = useState<Theme | undefined>();
  // State to store global styles that override the theme
  const [globalStyles, setGlobalStyles] = useState<Partial<Theme>>({});

  // Function to update global styles
  const updateGlobalStyles = useCallback((styles: Partial<Theme>) => {
    setGlobalStyles((prevStyles) => ({ ...prevStyles, ...styles }));
  }, []);

  return {
    currentTheme,
    setCurrentTheme,
    globalStyles,
    updateGlobalStyles,
  };
};
