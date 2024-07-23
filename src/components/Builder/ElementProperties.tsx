import React from "react";
import { useBuilderContext } from "@/context/BuilderContext";

export const ElementProperties: React.FC = () => {
  const { selectedElement, updateElement } = useBuilderContext();

  if (!selectedElement) return null;

  // Render properties based on element type
  const renderProperties = () => {
    switch (selectedElement.type) {
      case "text":
        return (
          <>
            <input
              type="text"
              value={selectedElement.content}
              onChange={(e) =>
                updateElement({ ...selectedElement, content: e.target.value })
              }
            />
            {/* Add more text-specific properties */}
          </>
        );
      case "image":
        return (
          <>
            <input
              type="text"
              value={selectedElement.src}
              onChange={(e) =>
                updateElement({ ...selectedElement, src: e.target.value })
              }
            />
            {/* Add more image-specific properties */}
          </>
        );
      // Add cases for other element types
    }
  };

  return (
    <div className="p-4 border-l">
      <h3 className="text-lg font-semibold mb-4">Element Properties</h3>
      {renderProperties()}
    </div>
  );
};
