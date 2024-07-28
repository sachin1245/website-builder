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
  const { deleteElement, setSelectedElement, currentTheme, globalStyles } =
    useBuilderContext();

  // Merge current theme with global styles and element-specific styles
  const appliedStyle = {
    ...currentTheme.colors,
    ...globalStyles.colors,
    ...style,
    fontFamily:
      style.fontFamily || globalStyles.fonts?.body || currentTheme.fonts.body,
  };

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
          ...appliedStyle,
          width: "100%",
          height: "100%",
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
        }}
        onClick={() =>
          setSelectedElement({
            id,
            content,
            style: appliedStyle,
            sectionId,
            type: "text",
          })
        }
      >
        {content}
      </p>
      {showDelete && (
        <div className="absolute -top-8 right-2 flex gap-2">
          <button
            onClick={() => deleteElement(sectionId, id)}
            className="bg-red-500  p-3rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
