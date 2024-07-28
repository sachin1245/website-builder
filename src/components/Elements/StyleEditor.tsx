import React from "react";

interface StyleEditorProps {
  style: React.CSSProperties;
  onStyleChange: (newStyle: React.CSSProperties) => void;
}

export const StyleEditor: React.FC<StyleEditorProps> = ({
  style,
  onStyleChange,
}) => {
  const handleChange = (property: string, value: string) => {
    onStyleChange({ ...style, [property]: value });
  };

  return (
    <div className="style-editor text-black p-2 bg-white-300 rounded">
      <h3 className="font-bold mb-2">Style Properties</h3>
      <div className="grid grid-cols-1 gap-2 z-10  min-w-[160px] overflow-y-auto">
        <div>
          <label className="block text-sm font-medium">Color</label>
          <input
            type="color"
            value={(style.color as string) || "#000000"}
            onChange={(e) => handleChange("color", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium ">Background Color</label>
          <input
            type="color"
            value={(style.backgroundColor as string) || "#ffffff"}
            onChange={(e) => handleChange("backgroundColor", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Font Size (px)</label>
          <input
            type="number"
            value={parseInt(style.fontSize as string) || 16}
            onChange={(e) => handleChange("fontSize", `${e.target.value}px`)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium ">Font Weight</label>
          <select
            value={(style.fontWeight as string) || "normal"}
            onChange={(e) => handleChange("fontWeight", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">
            Border Radius (px)
          </label>
          <input
            type="number"
            value={parseInt(style.borderRadius as string) || 0}
            onChange={(e) =>
              handleChange("borderRadius", `${e.target.value}px`)
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Padding (px)</label>
          <input
            type="number"
            value={parseInt(style.padding as string) || 0}
            onChange={(e) => handleChange("padding", `${e.target.value}px`)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};
