import React, { useState, useEffect } from "react";
import { useBuilderContext } from "@/context/BuilderContext";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

export const Sidebar: React.FC = () => {
  const {
    pages,
    currentPageId,
    addPage,
    deletePage,
    setCurrentPage,
    updatePages,
  } = useBuilderContext();
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editedPageName, setEditedPageName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (pages.length === 0) {
      handleAddPage();
    }
  }, []);

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

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-20 bg-indigo-600 text-white p-2 rounded-r-md transition-transform duration-300 ease-in-out hover:bg-indigo-700"
        style={{
          transform: `translateY(-50%) ${
            isOpen ? "translateX(256px)" : "translateX(0)"
          }`,
        }}
      >
        {isOpen ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
      </button>

      <div
        className={`sidebar fixed md:static inset-y-0 left-0 w-64 bg-indigo-900 text-white p-4 overflow-y-auto flex flex-col h-full transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
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
                  onKeyPress={(e) =>
                    e.key === "Enter" && confirmEditing(page.id)
                  }
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
                    className="text-red-500 hover:text-red-700"
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
    </>
  );
};
