import React from "react";
import Link from "next/link";
import { useBuilderContext } from "@/context/BuilderContext";
import { saveTemplate } from "@/utils/templateUtils";
import { PreviewButton } from "../Builder/PreviewButton";
import { FaSave, FaFolderOpen, FaUndo, FaRedo } from "react-icons/fa";

export const NavigationBar: React.FC = () => {
  const {
    currentPageId,
    pages,
    undo,
    redo,
    canUndo,
    canRedo,
    currentTheme,
    globalStyles,
  } = useBuilderContext();

  // Merge current theme with global styles
  const appliedTheme = {
    ...currentTheme,
    colors: { ...currentTheme?.colors, ...globalStyles.colors },
    fonts: { ...currentTheme?.fonts, ...globalStyles.fonts },
  };

  const currentPage = pages.find((page) => page.id === currentPageId);

  const handleSaveTemplate = () => {
    if (currentPage) {
      saveTemplate(currentPage);
      alert("Template saved successfully!");
    } else {
      alert("No page selected to save as template.");
    }
  };

  return (
    <nav
      className="bg-gray-900 text-white p-4"
      style={{
        backgroundColor: appliedTheme.colors.background,
        color: appliedTheme.colors.text,
        fontFamily: appliedTheme.fonts.body,
        borderBottom: `1px solid ${appliedTheme.colors.border || "#e2e8f0"}`,
      }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Website Builder</div>
        <div className="flex space-x-4">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`flex items-center px-3 py-2 rounded transition-colors ${
              canUndo
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            <FaUndo className="mr-2" /> Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`flex items-center px-3 py-2 rounded transition-colors ${
              canRedo
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            <FaRedo className="mr-2" /> Redo
          </button>
          <button
            onClick={handleSaveTemplate}
            className="flex items-center px-3 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            <FaSave className="mr-2" /> Save Template
          </button>
          <Link
            href="/load-template"
            className="flex items-center px-3 py-2 bg-green-500 rounded hover:bg-green-600 transition-colors"
          >
            <FaFolderOpen className="mr-2" /> Load Template
          </Link>
          {currentPage && <PreviewButton slug={currentPage.slug} />}
        </div>
      </div>
    </nav>
  );
};
