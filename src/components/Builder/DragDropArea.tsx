import React, { useRef, useCallback } from "react";
import { useDrop } from "react-dnd";
import { useBuilderContext } from "@/context/BuilderContext";
import { TextBlock } from "../Elements/TextElement";
import { ImageElement } from "../Elements/ImageElement";
import { VideoElement } from "../Elements/VideoElement";
import { ButtonElement } from "../Elements/ButtonElement";
import { Element } from "@/types/Element";

export const DragDropArea: React.FC = () => {
  const { elements, moveElement } = useBuilderContext();
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback(
    (id: string, delta: { x: number; y: number }) => {
      const element = elements.find((el) => el.id === id) as Element;

      if (element) {
        const parseValue = (value: string | number | undefined): number => {
          if (typeof value === "string") {
            return parseFloat(value) || 0;
          }
          return value || 0;
        };

        const left = Math.round(
          (parseValue(element.style.left) || 0) + delta.x
        );
        const top = Math.round((parseValue(element.style.top) || 0) + delta.y);
        moveElement(id, { left, top });
      }
    },
    [elements, moveElement]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ["text", "image", "video", "button"],
      drop: (item: { id: string; type: string }, monitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        if (delta) {
          handleDrop(item.id, delta);
        }
      },
    }),
    [handleDrop]
  );

  drop(dropRef);

  const renderElement = (element: any) => {
    const props = {
      ...element,
      style: {
        ...element.style,
        position: "absolute",
        left: element.style.left || 0,
        top: element.style.top || 0,
      },
    };

    switch (element.type) {
      case "text":
        return <TextBlock key={element.id} {...props} />;
      case "image":
        return <ImageElement key={element.id} {...props} />;
      case "video":
        return <VideoElement key={element.id} {...props} />;
      case "button":
        return <ButtonElement key={element.id} {...props} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={dropRef}
      className="w-full h-auto min-h-[600px] bg-gray-100 relative border border-gray-300 overflow-hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
    >
      {elements.map(renderElement)}
    </div>
  );
};
