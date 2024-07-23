import React, { useState } from "react";
import { useElementDrag } from "@/hooks/useElementDrag";
import { useBuilderContext } from "@/context/BuilderContext";
import { StyleEditor } from "./StyleEditor";

interface ButtonElementProps {
  id: string;
  content: string;
  style: React.CSSProperties;
}

export const ButtonElement: React.FC<ButtonElementProps> = ({
  id,
  content,
  style,
}) => {
  const { updateElement, deleteElement } = useBuilderContext();
  const { isDragging, drag } = useElementDrag("button", { id, type: "button" });
  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showStyleEditor, setShowStyleEditor] = useState(false);

  const elementRef = React.useRef<HTMLDivElement>(null);
  drag(elementRef);

  const handleDoubleClick = () => setIsEditing(true);
  const handleBlur = () => setIsEditing(false);

  const handleStyleChange = (newStyle: React.CSSProperties) => {
    updateElement({ id, type: "text", content, style: newStyle });
  };

  return (
    <div
      ref={elementRef}
      style={{
        color: "black",
        ...style,
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
      }}
      className="relative p-0 bg-white border border-gray-300 rounded shadow-sm"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {isEditing ? (
        <input
          type="text"
          key={id}
          value={content}
          onChange={(e) => {
            console.log(e.target.value);
            updateElement({
              id,
              type: "button",
              content: e.target.value,
              style,
            });
          }}
          onBlur={handleBlur}
          className="w-full p-1 border border-gray-300 rounded text-black"
          autoFocus
        />
      ) : (
        <button
          className="w-full h-full bg-blue-500 text-white rounded hover:bg-blue-600 px-4 py-2"
          onDoubleClick={handleDoubleClick}
        >
          {content}
        </button>
      )}
      {showDelete && (
        <div className="absolute -top-8 right-2 flex gap-2">
          <button
            onClick={() => setShowStyleEditor(!showStyleEditor)}
            className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
          >
            Style
          </button>
          <button
            onClick={() => deleteElement(id)}
            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
      {showStyleEditor && (
        <div className="text-black absolute top-full left-0 z-10 w-full mt-2">
          <StyleEditor style={style} onStyleChange={handleStyleChange} />
        </div>
      )}
    </div>
  );
};
