import { useState, useCallback } from "react";
import { Page, Element } from "@/types/Element";

export const useElements = (
  pages: Page[],
  updatePages: (newPages: Page[]) => void
) => {
  // State to keep track of the currently selected element
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  // Function to add a new element to a specific section
  const addElement = useCallback(
    (sectionId: string, element: Element) => {
      const newPages = pages.map((page) => ({
        ...page,
        sections: page.sections.map((section) =>
          section.id === sectionId
            ? { ...section, elements: [...section.elements, element] }
            : section
        ),
      }));
      updatePages(newPages);
    },
    [pages, updatePages]
  );

  // Function to update an existing element
  const updateElement = useCallback(
    (sectionId: string, updatedElement: Element) => {
      const newPages = pages.map((page) => ({
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
      }));

      updatePages(newPages);
      // Update selectedElement if it's the one being modified
      if (selectedElement && selectedElement.id === updatedElement.id) {
        setSelectedElement(updatedElement);
      }
    },
    [pages, updatePages, selectedElement]
  );

  // Function to move an element to a new position
  const moveElement = useCallback(
    (
      sectionId: string,
      elementId: string,
      newPosition: { left: number; top: number }
    ) => {
      const newPages = pages.map((page) => ({
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
                          left: `${newPosition.left.toFixed(2)}%`,
                          top: `${newPosition.top.toFixed(2)}%`,
                        },
                      }
                    : el
                ),
              }
            : section
        ),
      }));
      updatePages(newPages);
    },
    [pages, updatePages]
  );

  // Function to delete an element
  const deleteElement = useCallback(
    (sectionId: string, elementId: string) => {
      const newPages = pages.map((page) => ({
        ...page,
        sections: page.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                elements: section.elements.filter((el) => el.id !== elementId),
              }
            : section
        ),
      }));
      updatePages(newPages);
      // Clear selectedElement if it's the one being deleted
      if (selectedElement && selectedElement.id === elementId) {
        setSelectedElement(null);
      }
    },
    [pages, updatePages, selectedElement]
  );

  return {
    addElement,
    updateElement,
    moveElement,
    deleteElement,
    selectedElement,
    setSelectedElement,
  };
};
