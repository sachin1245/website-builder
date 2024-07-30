import React from "react";
import { useBuilderContext } from "@/context/BuilderContext";
import { themes, Theme } from "@/styles/themes";

export const GlobalStylesPanel: React.FC = () => {
  const { currentTheme, setCurrentTheme, globalStyles, updateGlobalStyles } =
    useBuilderContext();

  const handleThemeChange = (themeName: string) => {
    const newTheme = themes.find((theme) => theme.name === themeName);
    if (newTheme) {
      setCurrentTheme(newTheme);
      updateGlobalStyles({}); // Reset global styles when changing theme
    }
  };

  const handleStyleChange = (
    category: keyof Theme,
    property: string,
    value: string
  ) => {
    updateGlobalStyles({
      ...globalStyles,
      [category]: {
        ...((globalStyles[category] as any) || {}),
        [property]: value,
      },
    });
  };

  return (
    <div className="global-styles-panel">
      <h3 className="text-lg font-semibold mb-4">Theme & Global Styles</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium ">Theme</label>
        <select
          value={currentTheme?.name}
          onChange={(e) => handleThemeChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          {themes.map((theme) => (
            <option key={theme.name} value={theme.name}>
              {theme.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium ">Background Color</label>
          <input
            type="color"
            value={
              globalStyles.colors?.background || currentTheme?.colors.background
            }
            onChange={(e) =>
              handleStyleChange("colors", "background", e.target.value)
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium ">Text Color</label>
          <input
            type="color"
            value={globalStyles.colors?.text || currentTheme?.colors.text}
            onChange={(e) =>
              handleStyleChange("colors", "text", e.target.value)
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Primary Color</label>
          <input
            type="color"
            value={globalStyles.colors?.primary || currentTheme?.colors.primary}
            onChange={(e) =>
              handleStyleChange("colors", "primary", e.target.value)
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium ">Body Font</label>
          <select
            value={globalStyles.fonts?.body || currentTheme?.fonts.body}
            onChange={(e) => handleStyleChange("fonts", "body", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="Helvetica, sans-serif">Helvetica</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
          </select>
        </div>
      </div>
    </div>
  );
};
