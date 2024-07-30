"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Element, Page, Section } from "@/types/Element";
import { Theme } from "../styles/themes";
import { v4 as uuidv4 } from "uuid";

import { usePages } from "@/hooks/usePages";
import { useSections } from "@/hooks/useSections";
import { useElements } from "@/hooks/useElements";
import { useHistory } from "@/hooks/useHistory";
import { useTheme } from "@/hooks/useTheme";

interface BuilderContextType {
  pages: Page[];
  currentPageId: string;
  addPage: (pageData: Partial<Page>) => Page;
  deletePage: (pageId: string) => void;
  setCurrentPage: (pageId: string) => void;
  updatePages: (pages: Page[]) => void;
  addSection: (pageId: string) => void;
  updateSection: (
    pageId: string,
    sectionId: string,
    updatedSection: Section
  ) => void;
  addElement: (sectionId: string, element: Element) => void;
  updateElement: (sectionId: string, updatedElement: Element) => void;
  moveElement: (
    sectionId: string,
    elementId: string,
    position: { left: number; top: number }
  ) => void;
  deleteElement: (sectionId: string, elementId: string) => void;
  selectedElement: Element | null;
  setSelectedElement: (element: Element | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  currentTheme: Theme | undefined;
  setCurrentTheme: (theme: Theme) => void;
  globalStyles: Partial<Theme>;
  updateGlobalStyles: (styles: Partial<Theme>) => void;
}

// Create a context with undefined as initial value
const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Manage pages state at this level
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string>("");
  const isInitialized = useRef(false);

  // Initialize history hook
  const { addToHistory, undo, redo, canUndo, canRedo } = useHistory(
    pages,
    setPages
  );

  // Define updatePages function
  const updatePages = useCallback(
    (newPages: Page[]) => {
      setPages(newPages);
      addToHistory(newPages);
    },
    [addToHistory]
  );

  // Effect to initialize state from localStorage or create default page
  useEffect(() => {
    if (!isInitialized.current) {
      const savedState = localStorage.getItem("builderState");
      if (savedState) {
        const { pages: savedPages, currentPageId: savedCurrentPageId } =
          JSON.parse(savedState);
        setPages(savedPages);
        setCurrentPageId(savedCurrentPageId);
        addToHistory(savedPages);
      } else {
        const defaultPage: Page = {
          id: uuidv4(),
          name: "Home",
          slug: "home",
          sections: [
            {
              id: uuidv4(),
              elements: [],
              background: {
                type: "color",
                value: "#ffffff",
              },
            },
          ],
        };
        setPages([defaultPage]);
        setCurrentPageId(defaultPage.id);
        addToHistory([defaultPage]);
      }
      isInitialized.current = true;
    }
  }, [addToHistory]);

  // Effect to save state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem(
        "builderState",
        JSON.stringify({ pages, currentPageId })
      );
    }
  }, [pages, currentPageId]);

  // Initialize other hooks
  const { addPage, deletePage } = usePages(
    pages,
    updatePages,
    currentPageId,
    setCurrentPageId
  );

  const { addSection, updateSection } = useSections(pages, updatePages);

  const {
    addElement,
    updateElement,
    moveElement,
    deleteElement,
    selectedElement,
    setSelectedElement,
  } = useElements(pages, updatePages);
  const { currentTheme, setCurrentTheme, globalStyles, updateGlobalStyles } =
    useTheme();

  return (
    <BuilderContext.Provider
      value={{
        pages,
        currentPageId,
        addPage,
        deletePage,
        setCurrentPage: setCurrentPageId,
        updatePages,
        addSection,
        updateSection,
        addElement,
        updateElement,
        moveElement,
        deleteElement,
        selectedElement,
        setSelectedElement,
        undo,
        redo,
        canUndo,
        canRedo,
        currentTheme,
        setCurrentTheme,
        globalStyles,
        updateGlobalStyles,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

// Custom hook to use the BuilderContext
export const useBuilderContext = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilderContext must be used within a BuilderProvider");
  }
  return context;
};
