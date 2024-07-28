import React, { useState, useRef } from "react";
import { useElementDrag } from "@/hooks/useElementDrag";
import { useBuilderContext } from "@/context/BuilderContext";

interface TextElementProps {
  id: string;
  content: string;
  style: React.CSSProperties;
  sectionId: string;
}

export const TextElement: React.FC<TextElementProps> = ({
  id,
  content,
  style,
  sectionId,
}) => {
  const { deleteElement, setSelectedElement } = useBuilderContext();

  const [showDelete, setShowDelete] = useState(false);

  const { isDragging, drag } = useElementDrag("text", { id, type: "text" });
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
      className="absolute p-0 hover:border text-center hover:border-gray-300 rounded hover:shadow-sm"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <p
        style={{
          color: style.color || "black",
          backgroundColor: style.backgroundColor,
          fontSize: style.fontSize,
          padding: style.padding || "5px",
          fontWeight: style.fontWeight,
          borderRadius: style.borderRadius,
        }}
        onClick={() =>
          setSelectedElement({ id, content, style, sectionId, type: "text" })
        }
      >
        {content}
      </p>
      {showDelete && (
        <div className="absolute -top-8 right-2 flex gap-2">
          <button
            onClick={() => deleteElement(sectionId, id)}
            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
