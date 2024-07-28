import React, { useState, useRef } from "react";
import { useElementDrag } from "@/hooks/useElementDrag";
import { useBuilderContext } from "@/context/BuilderContext";

interface ButtonElementProps {
  id: string;
  content: string;
  style: React.CSSProperties;
  sectionId: string;
}

export const ButtonElement: React.FC<ButtonElementProps> = ({
  id,
  content,
  style,
  sectionId,
}) => {
  const { deleteElement, setSelectedElement } = useBuilderContext();
  const [showDelete, setShowDelete] = useState(false);

  const { isDragging, drag } = useElementDrag("button", { id, type: "button" });
  const elementRef = useRef<HTMLDivElement>(null);
  drag(elementRef);

  return (
    <div
      ref={elementRef}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
      className="absolute rounded shadow-sm"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <button
        style={{
          color: style.color,
          backgroundColor: style.backgroundColor,
          fontSize: style.fontSize,
          padding: style.padding,
          fontWeight: style.fontWeight,
          borderRadius: style.borderRadius,
        }}
        className="w-full p-2 h-full bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() =>
          setSelectedElement({
            id,
            content,
            style,
            sectionId,
            type: "button",
          })
        }
      >
        {content}
      </button>
      {showDelete && (
        <div className="absolute -top-8 right-2 z-1000 flex gap-2">
          <button
            onClick={() => deleteElement(sectionId, id)}
            className="bg-red-500 text-white p-1 z-1000 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
