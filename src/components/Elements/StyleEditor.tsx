import React from "react";
import { Element } from "@/types/Element";
import {
  FaPalette,
  FaFont,
  FaAlignLeft,
  FaExpand,
  FaCog,
  FaPlay,
} from "react-icons/fa";

export const styleProperties: Record<
  string,
  Record<string, { icon: JSX.Element; label: string }>
> = {
  common: {
    animation: { icon: <FaPlay />, label: "Animation" },
    animationDuration: { icon: <FaPlay />, label: "Animation Duration" },
    animationDelay: { icon: <FaPlay />, label: "Animation Delay" },
  },
  text: {
    textAlign: { icon: <FaAlignLeft />, label: "Align" },
    fontSize: { icon: <FaFont />, label: "Font Size" },
    fontWeight: { icon: <FaFont />, label: "Font Weight" },
    borderRadius: { icon: <FaCog />, label: "Border Radius" },
    color: { icon: <FaPalette />, label: "Color" },
    backgroundColor: { icon: <FaPalette />, label: "Bg Color" },
  },
  image: {
    objectFit: { icon: <FaExpand />, label: "Object Fit" },
  },
  button: {
    textAlign: { icon: <FaAlignLeft />, label: "Align" },
    fontSize: { icon: <FaFont />, label: "Font Size" },
    fontWeight: { icon: <FaFont />, label: "Font Weight" },
    borderRadius: { icon: <FaCog />, label: "Border Radius" },
    color: { icon: <FaPalette />, label: "Color" },
    backgroundColor: { icon: <FaPalette />, label: "Bg Color" },
  },
};

export const getStylePropertiesForType = (type: string) => {
  return { ...styleProperties.common, ...(styleProperties[type] || {}) };
};

interface StyleEditorProps {
  element: Element;
  property: string;
  onUpdate: (updates: Partial<Element>) => void;
}

export const StyleEditor: React.FC<StyleEditorProps> = ({
  element,
  property,
  onUpdate,
}) => {
  const handleStyleChange = (value: string) => {
    onUpdate({ style: { ...element.style, [property]: value } });
  };

  switch (property) {
    case "color":
    case "backgroundColor":
      return (
        <input
          type="color"
          value={element.style[property] || "#000000"}
          onChange={(e) => handleStyleChange(e.target.value)}
          className="w-full"
        />
      );
    case "fontSize":
    case "padding":
    case "margin":
    case "borderRadius":
      return (
        <input
          type="text"
          value={element.style[property] || ""}
          onChange={(e) => handleStyleChange(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder={`Enter ${property} (e.g., 16px, 1rem, 5%)`}
        />
      );
    case "fontWeight":
      return (
        <select
          value={element.style.fontWeight || "normal"}
          onChange={(e) => handleStyleChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="bolder">Bolder</option>
          <option value="lighter">Lighter</option>
        </select>
      );
    case "textAlign":
      return (
        <select
          value={(element.style.textAlign as string) || "left"}
          onChange={(e) => handleStyleChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      );
    case "objectFit":
      return (
        <select
          value={(element.style.objectFit as string) || "cover"}
          onChange={(e) => handleStyleChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
          <option value="scale-down">Scale Down</option>
        </select>
      );
    case "animation":
      return (
        <select
          value={(element.style.animation as string)?.split(" ")[0] || "none"}
          onChange={(e) =>
            handleStyleChange(
              `${e.target.value} ${element.style.animationDuration || "1s"} ${
                element.style.animationDelay || "0s"
              }`
            )
          }
          className="w-full p-2 border rounded"
        >
          <option value="none">None</option>
          <option value="fade">Fade</option>
          <option value="slide">Slide</option>
          <option value="bounce">Bounce</option>
        </select>
      );
    case "animationDuration":
      return (
        <input
          type="text"
          value={element.style[property] || ""}
          onChange={(e) => handleStyleChange(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder={`Enter ${property} (e.g., 0.5s, 1s)`}
        />
      );
    case "animationDelay":
      return (
        <input
          type="text"
          value={element.style[property] || ""}
          onChange={(e) => handleStyleChange(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder={`Enter ${property} (e.g., 0.5s, 1s)`}
        />
      );
    default:
      return null;
  }
};
