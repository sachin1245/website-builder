import React, { useState } from "react";
import { useBuilderContext } from "@/context/BuilderContext";
import { NavigationBar } from "../Navigation/NavigationBar";
import { DragDropArea } from "./DragDropArea";
import { ElementProperties } from "./ElementProperties";
import { PreviewMode } from "../Preview/PreviewMode";
import { createNewElement } from "@/utils/elementUtils";
import { Element } from "@/types/Element";

export const Builder: React.FC = () => {
  const { theme, addElement } = useBuilderContext();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleAddElement = (type: "text" | "image" | "video" | "button") => {
    const newElement = createNewElement(type) as Element;
    addElement(newElement);
  };

  return (
    <div className={`builder-container ${theme} bg-gray-100 min-h-screen`}>
      <NavigationBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {isPreviewMode ? "Edit Mode" : "Preview Mode"}
          </button>
          {!isPreviewMode && (
            <div>
              <button
                onClick={() => handleAddElement("text")}
                className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Add Text
              </button>
              <button
                onClick={() => handleAddElement("image")}
                className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Add Image
              </button>
              <button
                onClick={() => handleAddElement("video")}
                className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Add Video
              </button>
              <button
                onClick={() => handleAddElement("button")}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Add Button
              </button>
            </div>
          )}
        </div>
        {isPreviewMode ? (
          <PreviewMode />
        ) : (
          <div className="flex">
            <div className="w-3/4 pr-4">
              <DragDropArea />
            </div>
            <div className="w-1/4">
              <ElementProperties />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
