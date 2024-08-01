// src/components/Builder/ElementPropertiesPanel.tsx
import React, { useState } from "react";
import { useBuilderContext } from "@/context/BuilderContext";
import { FaTimes, FaGlobe } from "react-icons/fa";
import {
  StyleEditor,
  getStylePropertiesForType,
} from "../Elements/StyleEditor";
import { GlobalStyles, globalStyleProperties } from "./GlobalStyles";
import { ElementProperties, elementProperties } from "./ElementProperties";

export const ElementPropertiesPanel: React.FC = () => {
  const { selectedElement, updateElement, globalStyles, updateGlobalStyles } =
    useBuilderContext();
  const [activeProperty, setActiveProperty] = useState<string | null>(null);
  const [showGlobalStyles, setShowGlobalStyles] = useState(!selectedElement);

  const handleUpdate = (updates: Partial<Element>) => {
    if (selectedElement) {
      updateElement(selectedElement.sectionId, {
        ...selectedElement,
        ...updates,
      });
    }
  };

  const handlePropertyClick = (property: string) => {
    setActiveProperty(activeProperty === property ? null : property);
  };

  const renderPropertyPanel = () => {
    if (!selectedElement || !activeProperty) return null;

    if (activeProperty in getStylePropertiesForType(selectedElement.type)) {
      return (
        <StyleEditor
          element={selectedElement}
          property={activeProperty}
          onUpdate={handleUpdate}
        />
      );
    }

    return (
      <ElementProperties
        element={selectedElement}
        property={activeProperty}
        onUpdate={handleUpdate}
      />
    );
  };

  const renderPanel = () => {
    if (showGlobalStyles) {
      return (
        <GlobalStyles
          globalStyles={globalStyles}
          updateGlobalStyles={updateGlobalStyles}
        />
      );
    }

    if (!selectedElement) {
      return null;
    }

    const styleProperties = getStylePropertiesForType(selectedElement.type);
    const specificProperties = elementProperties[selectedElement.type] || {};

    const availableProperties = {
      ...specificProperties,
      ...styleProperties,
    };

    return (
      <>
        <div className="flex overflow-x-auto p-2 scrollbar-hide">
          {Object.entries(availableProperties).map(([key, { icon, label }]) => (
            <button
              key={key}
              className={`flex flex-col items-center p-2 mr-4 min-w-[60px] ${
                activeProperty === key ? "text-blue-500" : "text-gray-600"
              }`}
              onClick={() => handlePropertyClick(key)}
            >
              {icon}
              <span className="text-xs mt-1 whitespace-wrap">{label}</span>
            </button>
          ))}
        </div>
        {activeProperty && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{activeProperty}</h3>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setActiveProperty(null)}
              >
                <FaTimes />
              </button>
            </div>
            {renderPropertyPanel()}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="element-properties-panel bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-between items-center p-2 border-b border-gray-200">
        {/* <h2 className="text-lg font-semibold">
          {showGlobalStyles ? "Global Styles" : "Element Properties"}
        </h2> */}
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => setShowGlobalStyles(!showGlobalStyles)}
        >
          {showGlobalStyles ? "Show Element Properties" : "Show Global Styles"}
        </button>
      </div>
      {renderPanel()}
    </div>
  );
};
