import React, { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { useBuilderContext } from "@/context/BuilderContext";
import { StyleEditor } from "./StyleEditor";

interface TextBlockProps {
  id: string;
  content: string;
  style: React.CSSProperties;
}

export const TextBlock: React.FC<TextBlockProps> = ({ id, content, style }) => {
  const { updateElement, deleteElement } = useBuilderContext();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showStyleEditor, setShowStyleEditor] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "text",
    item: { id, type: "text", left: style.left, top: style.top },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  drag(elementRef);

  useEffect(() => {
    if (!content) {
      setIsEditing(true);
    }
  }, []);

  const handleStyleChange = (newStyle: React.CSSProperties) => {
    updateElement({ id, type: "text", content, style: newStyle });
  };

  return (
    <div
      ref={elementRef}
      style={{
        color: "black",
        ...style,
        position: "absolute",
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        minWidth: "10%",
        minHeight: "5%",
      }}
      className="p-2 bg-white border border-gray-300 rounded shadow-sm"
      onDoubleClick={() => setIsEditing(true)}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => {
        setShowDelete(false);
      }}
    >
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) =>
            updateElement({ id, type: "text", content: e.target.value, style })
          }
          onBlur={() => {
            setIsEditing(false);
            setShowStyleEditor(false);
          }}
          className="w-full h-full resize-none border-none focus:outline-none bg-transparent"
          autoFocus
        />
      ) : (
        <div>{content}</div>
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
