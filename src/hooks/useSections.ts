import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Page, Section } from "@/types/Element";

export const useSections = (
  pages: Page[],
  updatePages: (newPages: Page[]) => void
) => {
  // Function to add a new section to a specific page
  const addSection = useCallback(
    (pageId: string) => {
      const newSection: Section = {
        id: uuidv4(),
        elements: [],
        background: {
          type: "color",
          value: "#ffffff",
        },
      };

      // Create new pages array with the new section added to the specified page
      const newPages = pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              sections: [...page.sections, newSection],
            }
          : page
      );
      updatePages(newPages);
    },
    [pages, updatePages]
  );

  // Function to update an existing section
  const updateSection = useCallback(
    (pageId: string, sectionId: string, updatedSection: Section) => {
      // Create new pages array with the updated section
      const newPages = pages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              sections: page.sections.map((section) =>
                section.id === sectionId ? updatedSection : section
              ),
            }
          : page
      );
      updatePages(newPages);
    },
    [pages, updatePages]
  );

  return {
    addSection,
    updateSection,
  };
};
