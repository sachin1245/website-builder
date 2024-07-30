import React, { useState, useEffect } from "react";
import { useBuilderContext } from "@/context/BuilderContext";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

export const Sidebar: React.FC = () => {
  const {
    pages,
    currentPageId,
    addPage,
    deletePage,
    setCurrentPage,
    updatePages,
    currentTheme,
    globalStyles,
  } = useBuilderContext();
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editedPageName, setEditedPageName] = useState("");

  useEffect(() => {
    if (pages.length === 0) {
      handleAddPage();
    }
  }, []);

  // Merge current theme with global styles
  const appliedTheme = {
    ...currentTheme,
    colors: { ...currentTheme?.colors, ...globalStyles.colors },
    fonts: { ...currentTheme?.fonts, ...globalStyles.fonts },
  };

  const handleAddPage = () => {
    const newPage = addPage({ name: `Page ${pages.length + 1}` });
    setCurrentPage(newPage.id);
  };

  const handleDeletePage = (pageId: string) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      deletePage(pageId);
    }
  };
  const startEditing = (pageId: string, pageName: string) => {
    setEditingPageId(pageId);
    setEditedPageName(pageName);
  };

  const confirmEditing = (pageId: string) => {
    const updatedPages = pages.map((page) =>
      page.id === pageId ? { ...page, name: editedPageName } : page
    );
    updatePages(updatedPages);
    setEditingPageId(null);
  };

  return (
    <div
      className="sidebar w-64 bg-indigo-900 text-white p-4 overflow-y-auto flex flex-col h-full"
      style={{
        backgroundColor: appliedTheme.colors.background,
        color: appliedTheme.colors.text,
        fontFamily: appliedTheme.fonts.body,
        borderRight: `1px solid ${appliedTheme.colors.border || "#e2e8f0"}`,
      }}
    >
      <button
        onClick={handleAddPage}
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center justify-center"
      >
        <FaPlus className="mr-2" /> Add New Page
      </button>
      <ul className="flex-grow space-y-2">
        {pages.map((page) => (
          <li
            key={page.id}
            className={`rounded transition-colors ${
              page.id === currentPageId
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            {editingPageId === page.id ? (
              <input
                type="text"
                value={editedPageName}
                onChange={(e) => setEditedPageName(e.target.value)}
                onBlur={() => confirmEditing(page.id)}
                onKeyPress={(e) => e.key === "Enter" && confirmEditing(page.id)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                autoFocus
              />
            ) : (
              <div className="flex items-center w-full group px-3 py-2">
                <button
                  onClick={() => setCurrentPage(page.id)}
                  className="flex-grow text-left"
                >
                  {page.name}
                </button>
                <button
                  onClick={() => startEditing(page.id, page.name)}
                  className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700 ml-1"
                  onClick={() => handleDeletePage(page.id)}
                  disabled={pages.length <= 1}
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
