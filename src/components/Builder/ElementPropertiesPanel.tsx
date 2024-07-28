import React from "react";
import { useBuilderContext } from "@/context/BuilderContext";
import { Element } from "@/types/Element";
import { StyleEditor } from "../Elements/StyleEditor";

export const ElementPropertiesPanel: React.FC = () => {
  const { selectedElement, updateElement } = useBuilderContext();

  if (!selectedElement) {
    return <></>;
  }

  const handleUpdate = (updates: Partial<Element>) => {
    console.log(updates);
    updateElement(selectedElement.sectionId, {
      ...selectedElement,
      ...updates,
    } as Element);
  };

  const renderSpecificProperties = () => {
    switch (selectedElement.type) {
      case "text":
        return (
          <textarea
            value={selectedElement.content}
            onChange={(e) => handleUpdate({ content: e.target.value })}
            className="w-full p-2 border rounded"
          />
        );
      case "image":
        return (
          <>
            <label htmlFor="">Image URL</label>
            <input
              type="text"
              value={selectedElement.src}
              onChange={(e) => handleUpdate({ src: e.target.value })}
              placeholder={`${
                selectedElement.type.charAt(0).toUpperCase() +
                selectedElement.type.slice(1)
              } URL`}
              className="w-full p-2 border rounded"
            />
            <label htmlFor="">Image ALT</label>
            <input
              type="text"
              value={selectedElement.alt}
              onChange={(e) => handleUpdate({ alt: e.target.value })}
              placeholder={`${
                selectedElement.type.charAt(0).toUpperCase() +
                selectedElement.type.slice(1)
              } ALT`}
              className="w-full p-2 border rounded"
            />
          </>
        );
      case "video":
        return (
          <input
            type="text"
            value={selectedElement.src}
            onChange={(e) => handleUpdate({ src: e.target.value })}
            placeholder={`${
              selectedElement.type.charAt(0).toUpperCase() +
              selectedElement.type.slice(1)
            } URL`}
            className="w-full p-2 border rounded"
          />
        );
      case "button":
        return (
          <input
            type="text"
            value={selectedElement.content}
            onChange={(e) => handleUpdate({ content: e.target.value })}
            placeholder="Button Text"
            className="w-full p-2 border rounded"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="element-properties-panel text-black">
      <h3 className="text-lg text-black font-bold mb-4">Element Properties</h3>
      {renderSpecificProperties()}
      <StyleEditor
        style={selectedElement.style}
        onStyleChange={(newStyle) => handleUpdate({ style: newStyle })}
      />
    </div>
  );
};
