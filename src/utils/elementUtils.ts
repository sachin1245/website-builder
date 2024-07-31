import { v4 as uuidv4 } from "uuid";

export const createNewElement = (
  type: "text" | "image" | "video" | "button",
  sectionId: string,
  props = {}
) => {
  const baseElement = {
    id: uuidv4(),
    sectionId,
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
          width: "33%",
          height: "8%",
          color: "#000",
        },
        ...props,
      };
    case "image":
      return {
        ...baseElement,
        src: "https://picsum.photos/seed/picsum/500",
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
        src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
          backgroundColor: "rgb(59 130 246)",
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
