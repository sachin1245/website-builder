// src/components/Builder/ElementProperties.tsx
import React from "react";
import { Element, VideoElement } from "@/types/Element";
import { FaFont, FaImage, FaPlay, FaCheck } from "react-icons/fa";

export const elementProperties = {
  text: {
    content: { icon: <FaFont />, label: "Content" },
  },
  image: {
    src: { icon: <FaImage />, label: "Source" },
    alt: { icon: <FaFont />, label: "Alt Text" },
  },
  video: {
    src: { icon: <FaImage />, label: "Source" },
    autoplay: { icon: <FaPlay />, label: "Autoplay" },
    loop: { icon: <FaPlay />, label: "Loop" },
    controls: { icon: <FaCheck />, label: "Controls" },
  },
  button: {
    content: { icon: <FaFont />, label: "Text" },
  },
};

interface ElementPropertiesProps {
  element: Element;
  property: string;
  onUpdate: (updates: Partial<Element>) => void;
}

export const ElementProperties: React.FC<ElementPropertiesProps> = ({
  element,
  property,
  onUpdate,
}) => {
  const handleUpdate = (updates: Partial<Element>) => {
    onUpdate(updates);
  };

  switch (element.type) {
    case "text":
      if (property === "content") {
        return (
          <textarea
            value={element.content}
            onChange={(e) => handleUpdate({ content: e.target.value })}
            className="w-full p-2 border rounded mb-4"
          />
        );
      }
      break;
    case "image":
      if (property === "src") {
        return (
          <input
            type="text"
            value={element.src}
            onChange={(e) => handleUpdate({ src: e.target.value })}
            placeholder="Image URL"
            className="w-full p-2 border rounded mb-2"
          />
        );
      } else if (property === "alt") {
        return (
          <input
            type="text"
            value={element.alt}
            onChange={(e) => handleUpdate({ alt: e.target.value })}
            placeholder="Alt Text"
            className="w-full p-2 border rounded mb-2"
          />
        );
      }
      break;
    case "video":
      const isVideoElement = (element: Element): element is VideoElement => {
        return element.type === "video";
      };
      if (property === "src") {
        return (
          <input
            type="text"
            value={element.src}
            onChange={(e) => handleUpdate({ src: e.target.value })}
            placeholder="Video URL"
            className="w-full p-2 border rounded mb-2"
          />
        );
      } else if (
        isVideoElement(element) &&
        ["autoplay", "loop", "controls"].includes(property)
      ) {
        return (
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={element[property as keyof VideoElement] as boolean}
              onChange={(e) => handleUpdate({ [property]: e.target.checked })}
              className="mr-2"
            />
            <label>{property}</label>
          </div>
        );
      }
      break;
    case "button":
      if (property === "content") {
        return (
          <input
            type="text"
            value={element.content}
            onChange={(e) => handleUpdate({ content: e.target.value })}
            placeholder="Button Text"
            className="w-full p-2 border rounded mb-2"
          />
        );
      }
      break;
  }

  return null;
};
