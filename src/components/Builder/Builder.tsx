"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useBuilderContext } from "@/context/BuilderContext";
import { NavigationBar } from "../Navigation/NavigationBar";
import { Section } from "./Section";
import { Sidebar } from "../Navigation/Sidebar";
import { FaPlus, FaPalette } from "react-icons/fa";
import { ElementPropertiesPanel } from "./ElementPropertiesPanel";
import { GlobalStyles } from "./GlobalStyles";

export const Builder: React.FC = () => {
  const {
    pages,
    currentPageId,
    selectedElement,
    addSection,
    currentTheme,
    globalStyles,
  } = useBuilderContext();

  const [showGlobalStyles, setShowGlobalStyles] = useState(false);

  // Merge current theme with global styles
  const appliedTheme = {
    ...currentTheme,
    colors: { ...currentTheme?.colors, ...globalStyles.colors },
    fonts: { ...currentTheme?.fonts, ...globalStyles.fonts },
  };

  const currentPage = pages.find((page) => page.id === currentPageId);

  return (
    <div
      className="builder flex flex-col h-screen"
      style={{
        // backgroundColor: appliedTheme.colors.background,
        // color: appliedTheme.colors.text,
        fontFamily: appliedTheme.fonts.body,
      }}
    >
      <NavigationBar />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar />
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          <div className="main-content relative flex-grow p-6 overflow-y-auto bg-gray-100">
            <div className="w-full fixed z-10 -mt-6 overflow-y-auto">
              <ElementPropertiesPanel />
            </div>
            <div className="max-w-6xl mt-20">
              <div className="page-content space-y-6">
                {currentPage?.sections.map((section) => (
                  <Section
                    key={section.id}
                    pageId={currentPageId}
                    section={section}
                  />
                ))}
              </div>
              {currentPage && (
                <button
                  onClick={() => addSection(currentPageId)}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Section
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
