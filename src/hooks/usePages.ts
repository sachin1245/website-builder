import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Page } from "@/types/Element";
import { addOrUpdatePage, removePage } from "@/utils/pageUtils";

export const usePages = (
  pages: Page[],
  updatePages: (newPages: Page[]) => void,
  currentPageId: string,
  setCurrentPageId: (id: string) => void
) => {
  // Function to add a new page
  const addPage = useCallback(
    (pageData: Partial<Page>) => {
      const newPage: Page = {
        id: uuidv4(),
        name: pageData.name || "New Page",
        slug: pageData.slug || `page-${Date.now()}`,
        sections: pageData.sections || [
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

      // Generate a unique slug for the new page
      const slug = `${newPage.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-${uuidv4()}`;
      addOrUpdatePage(slug);

      const newPages = [...pages, newPage];
      updatePages(newPages);
      return newPage;
    },
    [pages, updatePages]
  );

  // Function to delete a page
  const deletePage = useCallback(
    (pageId: string) => {
      if (pages.length <= 1) {
        // Prevent deleting the last page
        console.warn("Cannot delete the last page");
        return;
      }

      const pageToDelete = pages.find((page) => page.id === pageId);
      if (pageToDelete) {
        removePage(pageToDelete.slug);
      }

      const newPages = pages.filter((page) => page.id !== pageId);
      updatePages(newPages);

      // If the current page is being deleted, switch to another page
      if (pageId === currentPageId) {
        setCurrentPageId(newPages[0].id);
      }
    },
    [pages, updatePages, currentPageId, setCurrentPageId]
  );

  return {
    addPage,
    deletePage,
  };
};
