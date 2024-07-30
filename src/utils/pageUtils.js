export const loadCreatedPages = async () => {
  try {
    const response = await fetch("/api/pages");
    return await response.json();
  } catch (err) {
    console.error("Error loading createdPages.json:", err);
    return { pages: [] };
  }
};

export const saveCreatedPages = async (slug) => {
  try {
    fetch("/api/pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
    });
  } catch (err) {
    console.error("Error saving createdPages.json:", err);
  }
};

export const addOrUpdatePage = async (slug) => {
  await loadCreatedPages().then((pages) => {
    if (!pages.pages.includes(slug)) {
      saveCreatedPages(slug);
    }
  });
};

export const removePage = async (slug) => {
  try {
    fetch("/api/pages", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
    });
  } catch (err) {
    console.error("Error deleting slug from createdPages.json:", err);
  }
};
