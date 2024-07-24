import React, { useState, useRef } from "react";
import { useElementDrag } from "@/hooks/useElementDrag";
import { useBuilderContext } from "@/context/BuilderContext";
import { StyleEditor } from "./StyleEditor";

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
  const { updateElement, deleteElement } = useBuilderContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showStyleEditor, setShowStyleEditor] = useState(false);

  const { isDragging, drag } = useElementDrag("button", { id, type: "button" });
  const elementRef = useRef<HTMLDivElement>(null);
  drag(elementRef);

  const handleUpdate = (updates: Partial<ButtonElementProps>) => {
    updateElement(sectionId, {
      id,
      type: "button",
      content,
      style,
      ...updates,
    });
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
      className="absolute rounded shadow-sm"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {isEditing ? (
        <input
          type="text"
          value={content}
          onChange={(e) => handleUpdate({ content: e.target.value })}
          onBlur={() => setIsEditing(false)}
          className="w-full text-black p-1 border border-gray-300 rounded"
          autoFocus
        />
      ) : (
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
          onDoubleClick={() => {
            setIsEditing(true);
            setShowStyleEditor(false);
          }}
        >
          {content}
        </button>
      )}
      {showDelete && (
        <div className="absolute -top-8 right-2 z-1000 flex gap-2">
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
            className="bg-red-500 text-white p-1 z-1000 rounded hover:bg-red-600"
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
