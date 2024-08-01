import React from "react";
import { createNewElement } from "@/utils/elementUtils";
import { useBuilderContext } from "@/context/BuilderContext";
import { DragDropArea } from "./DragDropArea";
import { Element, Section as SectionType } from "@/types/Element";

interface SectionProps {
  pageId: string;
  section: SectionType;
}

export const Section: React.FC<SectionProps> = ({ pageId, section }) => {
  const { addElement, updateSection, currentTheme, globalStyles } =
    useBuilderContext();

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

  const handleBackgroundChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    updateSection(pageId, section.id, {
      ...section,
      background: {
        ...section.background,
        [name]: value,
      },
    });
  };

  const sectionStyle: React.CSSProperties = {
    ...(section.background?.type === "color"
      ? { backgroundColor: section.background.value }
      : {
          backgroundImage: `url(${section.background.value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }),
    color: appliedTheme.colors.text,
  };

  return (
    <div className="section mb-6 p-4 rounded-lg shadow-sm">
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
      <div className="section-background-controls mb-2 flex flex-wrap gap-2">
        <select
          name="type"
          value={section.background.type}
          onChange={handleBackgroundChange}
          className="px-2 py-1 bg-white text-black rounded text-sm border border-gray-300"
        >
          <option value="color">Color</option>
          <option value="image">Image</option>
        </select>
        {section.background.type === "color" ? (
          <input
            type="color"
            name="value"
            value={section.background.value}
            onChange={handleBackgroundChange}
            className="px-2 py-1 bg-white rounded text-sm border border-gray-300"
          />
        ) : (
          <input
            type="text"
            name="value"
            value={section.background.value}
            onChange={handleBackgroundChange}
            placeholder="Enter image URL"
            className="px-2 py-1 bg-white text-black rounded text-sm border border-gray-300"
          />
        )}
      </div>
      <div className="drag-drop-area section-container">
        <DragDropArea
          style={sectionStyle}
          sectionId={section.id}
          elements={section.elements}
        />
      </div>
    </div>
  );
};
