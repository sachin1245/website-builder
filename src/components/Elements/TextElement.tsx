import React, { useState, useRef } from "react";
import { useElementDrag } from "@/hooks/useElementDrag";
import { useBuilderContext } from "@/context/BuilderContext";
import { StyleEditor } from "./StyleEditor";

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
  const { updateElement, deleteElement } = useBuilderContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showStyleEditor, setShowStyleEditor] = useState(false);

  const { isDragging, drag } = useElementDrag("text", { id, type: "text" });
  const elementRef = useRef<HTMLDivElement>(null);
  drag(elementRef);

  const handleUpdate = (updates: Partial<TextElementProps>) => {
    updateElement(sectionId, { id, type: "text", content, style, ...updates });
  };

  return (
    <div
      ref={elementRef}
      style={{
        top: style.top,
        left: style.left,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
      className="absolute p-0 hover:border text-center hover:border-gray-300 rounded hover:shadow-sm"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => handleUpdate({ content: e.target.value })}
          onBlur={() => setIsEditing(false)}
          className="w-full p-1 text-black h-full resize-none border-none focus:outline-none bg-transparent"
          autoFocus
        />
      ) : (
        <p
          style={{
            color: style.color || "black",
            backgroundColor: style.backgroundColor,
            fontSize: style.fontSize,
            padding: style.padding || "5px",
            fontWeight: style.fontWeight,
            borderRadius: style.borderRadius,
          }}
          onDoubleClick={() => {
            setIsEditing(true);
            setShowStyleEditor(false);
          }}
        >
          {content}
        </p>
      )}
      {showDelete && (
        <div className="absolute -top-8 right-2 flex gap-2">
          {!isEditing && (
            <button
              onClick={() => setShowStyleEditor(!showStyleEditor)}
              className="bg-blue-500 text-white p-1 z-1000 rounded hover:bg-blue-600"
            >
              Style
            </button>
          )}
          <button
            onClick={() => deleteElement(sectionId, id)}
            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
      {showStyleEditor && !isEditing && (
        <StyleEditor
          style={style}
          onStyleChange={(newStyle) => handleUpdate({ style: newStyle })}
        />
      )}
    </div>
  );
};
