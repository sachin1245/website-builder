import { v4 as uuidv4 } from "uuid";

export const createNewElement = (
  type: "text" | "image" | "video" | "button",
  props = {}
) => {
  const baseElement = {
    id: uuidv4(),
    type,
    style: {
      left: `${Math.floor(Math.random() * 80)}%`,
      top: `${Math.floor(Math.random() * 80)}%`,
      zIndex: 1,
    },
  };

  switch (type) {
    case "text":
      return {
        ...baseElement,
        content: "Add Text",
        style: {
          ...baseElement.style,
          width: "20%",
          height: "8%",
        },
        ...props,
      };
    case "image":
      return {
        ...baseElement,
        src: "https://via.placeholder.com/150",
        alt: "Placeholder image",
        style: {
          ...baseElement.style,
          width: "30%",
          height: "30%",
        },
        ...props,
      };
    case "video":
      return {
        ...baseElement,
        src: "https://example.com/placeholder-video.mp4",
        style: {
          ...baseElement.style,
          width: "40%",
          height: "30%",
        },
        ...props,
      };
    case "button":
      return {
        ...baseElement,
        content: "Click me",
        style: {
          ...baseElement.style,
          width: "15%",
          height: "8%",
        },
        ...props,
      };
    default:
      return baseElement;
  }
};

export const calculateElementSize = (element: any) => {
  // Implementation depends on how you want to determine element size
  // This is a simplified example
  return {
    width: element.style.width || 100,
    height: element.style.height || 100,
  };
};
