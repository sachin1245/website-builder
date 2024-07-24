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
  const { addElement } = useBuilderContext();

  const handleAddElement = (type: "text" | "image" | "video" | "button") => {
    const newElement = createNewElement(type) as Element;
    addElement(section.id, newElement);
  };

  return (
    <div className="section mb-4 p-4 border border-gray-300 rounded">
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