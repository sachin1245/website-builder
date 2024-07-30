import React, { useRef, useCallback } from "react";
import { useDrop } from "react-dnd";
import { useBuilderContext } from "@/context/BuilderContext";
import { TextElement } from "../Elements/TextElement";
import { ImageElement } from "../Elements/ImageElement";
import { VideoElement } from "../Elements/VideoElement";
import { ButtonElement } from "../Elements/ButtonElement";
import { Element } from "@/types/Element";

interface DragDropAreaProps {
  sectionId: string;
  elements: Element[];
  style: React.CSSProperties;
}

export const DragDropArea: React.FC<DragDropAreaProps> = ({
  sectionId,
  elements,
  style,
}) => {
  const { moveElement } = useBuilderContext();
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback(
    (id: string, delta: { x: number; y: number }) => {
      const element = elements.find((el) => el.id === id);
      if (element && dropRef.current) {
        const containerRect = dropRef.current.getBoundingClientRect();
        const parsePercentage = (
          value: string | number | undefined
        ): number => {
          if (typeof value === "string") {
            return parseFloat(value) || 0;
          }
          return value || 0;
        };

        const left = parsePercentage(element.style.left);
        const top = parsePercentage(element.style.top);
        const width = parsePercentage(element.style.width);
        const height = parsePercentage(element.style.height);

        // Calculate new position in percentages
        const newLeft = left + (delta.x / containerRect.width) * 100;
        const newTop = top + (delta.y / containerRect.height) * 100;

        // Ensure the element stays within the container bounds
        const clampedLeft = Math.max(0, Math.min(100 - width, newLeft));
        const clampedTop = Math.max(0, Math.min(100 - height, newTop));

        moveElement(sectionId, id, { left: clampedLeft, top: clampedTop });
      }
    },
    [elements, moveElement, sectionId]
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

  const renderElement = (element: Element) => {
    const commonProps = {
      id: element.id,
      style: element.style,
      sectionId: sectionId,
    };

    switch (element.type) {
      case "text":
        return (
          <TextElement
            key={element.id}
            {...commonProps}
            content={element.content}
          />
        );
      case "image":
        return (
          <ImageElement
            key={element.id}
            {...commonProps}
            src={element.src}
            alt={element.alt}
          />
        );
      case "video":
        return (
          <VideoElement key={element.id} {...commonProps} src={element.src} />
        );
      case "button":
        return (
          <ButtonElement
            key={element.id}
            {...commonProps}
            content={element.content}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={dropRef}
      className="relative drag-drop-area h-auto min-h-[400px] bg-gray-100 relative border border-gray-300 overflow-y-auto p-4"
      style={{ ...style, minHeight: "600px" }}
    >
      {/* {elements.map(renderElement)} */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {elements.map(renderElement)}
      </div>
    </div>
  );
};
