import React from "react";
import { createNewElement } from "@/utils/elementUtils";
import { useBuilderContext } from "@/context/BuilderContext";
import { DragDropArea } from "./DragDropArea";
import { Element } from "@/types/Element";

interface SectionProps {
  pageId: string;
  section: {
    id: string;
    elements: any[];
  };
}

export const Section: React.FC<SectionProps> = ({ pageId, section }) => {
  const { addElement, currentTheme, globalStyles } = useBuilderContext();

  // Merge current theme with global styles
  const appliedTheme = {
    ...currentTheme,
    colors: { ...currentTheme?.colors, ...globalStyles.colors },
    fonts: { ...currentTheme?.fonts, ...globalStyles.fonts },
  };

  const handleAddElement = (type: "text" | "image" | "video" | "button") => {
    const newElement = createNewElement(type, section.id) as Element;
    addElement(section.id, newElement);
  };

  return (
    <div
      className="section mb-6 p-4 rounded-lg shadow-sm"
      style={{
        color: appliedTheme.colors.text,
      }}
    >
      <div className="section-controls mb-2 flex flex-wrap gap-2">
        <button
          onClick={() => handleAddElement("text")}
          className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        >
          Add Text
        </button>
        <button
          onClick={() => handleAddElement("image")}
          className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        >
          Add Image
        </button>
        <button
          onClick={() => handleAddElement("video")}
          className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        >
          Add Video
        </button>
        <button
          onClick={() => handleAddElement("button")}
          className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        >
          Add Button
        </button>
      </div>
      <DragDropArea sectionId={section.id} elements={section.elements} />
    </div>
  );
};
