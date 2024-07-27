"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { addOrUpdatePage, removePage } from "@/utils/pageUtils";
import { Element, Page, Section } from "@/types/Element";
import { v4 as uuidv4 } from "uuid";

interface BuilderContextType {
  pages: Page[];
  currentPageId: string;
  addPage: (name: string) => void;
  setCurrentPage: (pageId: string) => void;
  updatePages: (pages: Page[]) => void;
  addSection: (pageId: string) => void;
  addElement: (sectionId: string, element: Element) => void;
  updateElement: (sectionId: string, updatedElement: Element) => void;
  moveElement: (
    sectionId: string,
    elementId: string,
    position: { left: number; top: number }
  ) => void;
  deleteElement: (sectionId: string, elementId: string) => void;
  saveTemplate: () => void;
  loadTemplate: (templateId: string) => void;
  getCurrentPageElements: () => Element[];
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageId, setCurrentPageId] = useState("");
  const [history, setHistory] = useState<Page[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const savedState = localStorage.getItem("builderState");
    console.log(savedState);
    if (savedState) {
      const { pages, currentPageId } = JSON.parse(savedState);
      const slug = pages.find((page: Page) => page.id === currentPageId)?.slug;
      setPages(pages);
      setCurrentPageId(currentPageId);
      setHistory([pages]);
      setHistoryIndex(0);
    } else {
      // Initialize with a default page if no saved state
      const defaultPage: Page = {
        id: uuidv4(),
        name: "Home",
        slug: "home",
        sections: [
          {
            id: uuidv4(),
            elements: [],
          },
        ],
      };
      setPages([defaultPage]);
      setCurrentPageId(defaultPage.id);
      setHistory([[defaultPage]]);
      setHistoryIndex(0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "builderState",
      JSON.stringify({ pages, currentPageId })
    );
  }, [pages, currentPageId]);

  const addToHistory = (newPages: Page[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newPages);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPages(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPages(history[historyIndex + 1]);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const addPage = (name: string) => {
    const slug = `${name.toLowerCase().replace(/\s+/g, "-")}-${uuidv4()}`;
    const newPage: Page = {
      id: uuidv4(),
      name,
      slug,
      sections: [
        {
          id: uuidv4(),
          elements: [],
        },
      ],
    };

    addOrUpdatePage(slug);

    const newPages = [...pages, newPage];
    setPages(newPages);
    setCurrentPageId(newPage.id);
    addToHistory(newPages);
  };

  const setCurrentPage = (id: string) => {
    setCurrentPageId(id);
  };

  const updatePages = (pages: Page[]) => {
    setPages(pages);
    addToHistory(pages);
  };

  const addSection = (pageId: string) => {
    const newPages = pages.map((page) =>
      page.id === pageId
        ? {
            ...page,
            sections: [...page.sections, { id: uuidv4(), elements: [] }],
          }
        : page
    );
    setPages(newPages);
    addToHistory(newPages);
  };

  const addElement = (sectionId: string, element: Element) => {
    const newPages = pages.map((page) =>
      page.id === currentPageId
        ? {
            ...page,
            sections: page.sections.map((section) =>
              section.id === sectionId
                ? { ...section, elements: [...section.elements, element] }
                : section
            ),
          }
        : page
    );
    setPages(newPages);
    addToHistory(newPages);
  };

  const updateElement = (sectionId: string, updatedElement: Element) => {
    const newPages = pages.map((page) =>
      page.id === currentPageId
        ? {
            ...page,
            sections: page.sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    elements: section.elements.map((el) =>
                      el.id === updatedElement.id ? updatedElement : el
                    ),
                  }
                : section
            ),
          }
        : page
    );
    setPages(newPages);
    addToHistory(newPages);
  };

  const deleteElement = (sectionId: string, elementId: string) => {
    const newPages = pages.map((page) =>
      page.id === currentPageId
        ? {
            ...page,
            sections: page.sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    elements: section.elements.filter(
                      (el) => el.id !== elementId
                    ),
                  }
                : section
            ),
          }
        : page
    );
    setPages(newPages);
    addToHistory(newPages);
  };

  const moveElement = (
    sectionId: string,
    elementId: string,
    newPosition: { left: number; top: number }
  ) => {
    const newPages = pages.map((page) =>
      page.id === currentPageId
        ? {
            ...page,
            sections: page.sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    elements: section.elements.map((el) =>
                      el.id === elementId
                        ? {
                            ...el,
                            style: {
                              ...el.style,
                              left: newPosition.left,
                              top: newPosition.top,
                            },
                          }
                        : el
                    ),
                  }
                : section
            ),
          }
        : page
    );
    setPages(newPages);
    addToHistory(newPages);
  };

  const saveTemplate = () => {
    const templates = JSON.parse(localStorage.getItem("templates") || "[]");
    const newTemplate = {
      id: uuidv4(),
      pages: pages,
    };
    localStorage.setItem(
      "templates",
      JSON.stringify([...templates, newTemplate])
    );
  };

  const loadTemplate = (templateId: string) => {
    const templates = JSON.parse(localStorage.getItem("templates") || "[]");
    const template = templates.find((t: any) => t.id === templateId);
    if (template) {
      setPages(template.pages);
      setCurrentPageId(template.pages[0].id);
    }
  };

  const getCurrentPageElements = () => {
    const currentPage = pages.find((page) => page.id === currentPageId);
    return currentPage
      ? currentPage.sections.flatMap((section) => section.elements)
      : [];
  };

  return (
    <BuilderContext.Provider
      value={{
        pages,
        currentPageId,
        addPage,
        setCurrentPage,
        updatePages,
        addSection,
        addElement,
        updateElement,
        moveElement,
        deleteElement,
        saveTemplate,
        loadTemplate,
        getCurrentPageElements,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilderContext = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilderContext must be used within a BuilderProvider");
  }
  return context;
};
