"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useBuilderContext } from "@/context/BuilderContext";
import { NavigationBar } from "../Navigation/NavigationBar";
import { useRouter } from "next/router";
import { Section } from "./Section";
import { PreviewButton } from "./PreviewButton";
import { saveTemplate } from "@/utils/templateUtils";
import Link from "next/link";

export const Builder: React.FC = () => {
  const {
    pages,
    currentPageId,
    addPage,
    setCurrentPage,
    updatePages,
    addSection,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useBuilderContext();
  // const router = useRouter();
  const [editingPageName, setEditingPageName] = useState(false);

  const currentPage = pages.find((page) => page.id === currentPageId);

  const handleAddPage = () => {
    const newPageName = `New Page ${pages.length + 1}`;
    const newPage = addPage({
      name: newPageName,
      slug: `page-${Date.now()}`,
      sections: [
        {
          id: uuidv4(),
          elements: [],
        },
      ],
    });
    setCurrentPage(newPage.id);
  };

  const handlePageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentPage) {
      const name = e.target.value;
      const updatedPages = pages.map((page) =>
        page.id === currentPage.id ? { ...page, name: name } : page
      );
      updatePages(updatedPages);
    }
  };

  const handleSaveTemplate = () => {
    if (currentPage) {
      saveTemplate(currentPage);
      alert("Template saved successfully!");
    } else {
      alert("No page selected to save as template.");
    }
  };

  return (
    <div className="builder flex flex-col md:flex-row h-screen">
      <div className="sidebar w-full md:w-64 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl text-purple-400 font-bold mb-4">Pages</h2>
        <ul className="mb-4 text-black">
          {pages.map((page) => (
            <li
              key={page.id}
              className={`mb-2 ${page.id === currentPageId ? "font-bold" : ""}`}
            >
              <button
                onClick={() => setCurrentPage(page.id)}
                className="text-left w-full px-2 py-1 rounded hover:bg-gray-200"
              >
                {page.name}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={handleAddPage}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Add New Page
        </button>
        <button
          onClick={handleSaveTemplate}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors mt-2"
        >
          Save Template
        </button>
        <Link
          href="/load-template"
          className="block w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-center mt-2"
        >
          Load Template
        </Link>
        {currentPage && <PreviewButton slug={currentPage.slug} />}
        <div className="flex gap-2 mt-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`w-1/2 px-4 py-2 ${
              canUndo ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"
            } text-white rounded transition-colors`}
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`w-1/2 px-4 py-2 ${
              canRedo ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"
            } text-white rounded transition-colors`}
          >
            Redo
          </button>
        </div>
      </div>
      <div className="main-content flex-grow p-4 overflow-y-auto">
        {currentPage ? (
          editingPageName ? (
            <input
              type="text"
              value={currentPage.name}
              onChange={handlePageNameChange}
              onBlur={() => setEditingPageName(false)}
              className="text-2xl block text-black font-bold mb-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <h1
              className="text-2xl text-blue-500 font-bold mb-4 cursor-pointer hover:text-blue-500"
              onClick={() => setEditingPageName(true)}
            >
              Page: {currentPage.name}
            </h1>
          )
        ) : (
          <h1 className="text-2xl text-blue-500 font-bold mb-4">
            No page selected
          </h1>
        )}
        {currentPage && (
          <button
            onClick={() => addSection(currentPageId)}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Add Section
          </button>
        )}
        <div className="page-content">
          {currentPage?.sections.map((section) => (
            <Section
              key={section.id}
              pageId={currentPageId}
              section={section}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
