import React, { useState } from "react";
import { FaGlobe, FaPalette, FaFont, FaTimes } from "react-icons/fa";
import { themes } from "@/styles/themes";
import { useBuilderContext } from "@/context/BuilderContext";

export const globalStyleProperties: Record<
  string,
  { icon: JSX.Element; label: string }
> = {
  backgroundColor: { icon: <FaPalette />, label: "Bg Color" },
  textColor: { icon: <FaPalette />, label: "Text Color" },
  primaryColor: { icon: <FaPalette />, label: "Primary Color" },
  fontFamily: { icon: <FaFont />, label: "Font Family" },
  theme: { icon: <FaGlobe />, label: "Theme" },
};

interface GlobalStylesProps {
  globalStyles: any;
  updateGlobalStyles: (styles: any) => void;
}

export const GlobalStyles: React.FC<GlobalStylesProps> = ({
  globalStyles,
  updateGlobalStyles,
}) => {
  const { currentTheme, setCurrentTheme } = useBuilderContext();
  const [activeProperty, setActiveProperty] = useState<string | null>(null);

  const handleUpdate = (key: string, value: string) => {
    if (key === "theme") {
      const newTheme = themes.find((theme) => theme.name === value);
      if (newTheme) {
        setCurrentTheme(newTheme);
      }
    } else if (key === "fontFamily") {
      updateGlobalStyles({ fonts: { ...globalStyles.fonts, body: value } });
    } else {
      updateGlobalStyles({ colors: { ...globalStyles.colors, [key]: value } });
    }
  };

  const renderPropertyPanel = () => {
    if (!activeProperty) return null;

    switch (activeProperty) {
      case "backgroundColor":
      case "textColor":
      case "primaryColor":
        return (
          <input
            type="color"
            value={globalStyles.colors?.[activeProperty] || "#ffffff"}
            onChange={(e) => handleUpdate(activeProperty, e.target.value)}
            className="w-full"
          />
        );
      case "fontFamily":
        return (
          <select
            value={globalStyles.fonts?.body || "Arial"}
            onChange={(e) => handleUpdate(activeProperty, e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
          </select>
        );
      case "theme":
        return (
          <select
            value={currentTheme?.name || "none"}
            onChange={(e) => handleUpdate(activeProperty, e.target.value)}
            className="w-full p-2 border rounded"
          >
            {themes.map((theme, index) => (
              <option key={index + 1} value={theme.name}>
                {theme.name}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex overflow-x-auto p-2 scrollbar-hide">
        {Object.entries(globalStyleProperties).map(([key, { icon, label }]) => (
          <button
            key={key}
            className={`flex flex-col items-center p-2 mr-4 min-w-[60px] ${
              activeProperty === key ? "text-blue-500" : "text-gray-600"
            }`}
            onClick={() =>
              setActiveProperty(activeProperty === key ? null : key)
            }
          >
            {icon}
            <span className="text-xs mt-1 whitespace-nowrap">{label}</span>
          </button>
        ))}
      </div>
      {activeProperty && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">
              {globalStyleProperties[activeProperty].label}
            </h3>
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
    </div>
  );
};
