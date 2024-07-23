"use client";
import React, { createContext, useContext, useState } from "react";
import { Element } from "@/types/Element";

interface Page {
  id: string;
  name: string;
  elements: Element[];
}

interface BuilderContextType {
  pages: Page[];
  currentPage: string;
  elements: Element[];
  selectedElement: Element | null;
  theme: string;
  addElement: (element: Element) => void;
  updateElement: (updatedElement: Element) => void;
  moveElement: (id: string, position: { left: number; top: number }) => void;
  deleteElement: (id: string) => void;
  setCurrentPage: (pageId: string) => void;
  setSelectedElement: (element: Element | null) => void;
  setTheme: (theme: string) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pages, setPages] = useState<Page[]>([
    { id: "1", name: "Home", elements: [] },
  ]);
  const [currentPage, setCurrentPage] = useState("1");
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [theme, setTheme] = useState("default");

  const elements =
    pages.find((page) => page.id === currentPage)?.elements || [];

  const addElement = (element: Element) => {
    setPages((prevPages) =>
      prevPages.map((page) => {
        console.log(page);
        return page.id === currentPage
          ? { ...page, elements: [...page.elements, element] }
          : page;
      })
    );
  };

  const updateElement = (updatedElement: Element) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === currentPage
          ? {
              ...page,
              elements: page.elements.map((el) =>
                el.id === updatedElement.id ? updatedElement : el
              ),
            }
          : page
      )
    );
  };

  const moveElement = (
    id: string,
    newPosition: { left: number; top: number }
  ) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === currentPage
          ? {
              ...page,
              elements: page.elements.map((el) =>
                el.id === id
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
          : page
      )
    );
  };

  const deleteElement = (id: string) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === currentPage
          ? { ...page, elements: page.elements.filter((el) => el.id !== id) }
          : page
      )
    );
  };

  return (
    <BuilderContext.Provider
      value={{
        pages,
        currentPage,
        elements,
        selectedElement,
        theme,
        addElement,
        updateElement,
        moveElement,
        deleteElement,
        setCurrentPage,
        setSelectedElement,
        setTheme,
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
