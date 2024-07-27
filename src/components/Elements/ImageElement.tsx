import React, { useState, useRef } from "react";
import { useElementDrag } from "@/hooks/useElementDrag";
import { useBuilderContext } from "@/context/BuilderContext";
import { StyleEditor } from "./StyleEditor";
import { ResizableElement } from "./ResizableElement";

interface ImageElementProps {
  id: string;
  src: string;
  alt: string;
  style: React.CSSProperties;
  sectionId: string;
}

export const ImageElement: React.FC<ImageElementProps> = ({
  id,
  src,
  alt,
  style,
  sectionId,
}) => {
  const { updateElement, deleteElement } = useBuilderContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showStyleEditor, setShowStyleEditor] = useState(false);

  const { isDragging, drag } = useElementDrag("image", { id, type: "image" });
  const elementRef = useRef<HTMLDivElement>(null);
  drag(elementRef);

  const handleUpdate = (updates: Partial<ImageElementProps>) => {
    updateElement(sectionId, {
      id,
      type: "image",
      src,
      alt,
      style,
      ...updates,
    });
  };

  const handleResize = (newStyle: React.CSSProperties) => {
    updateElement(sectionId, { id, type: "image", src, alt, style: newStyle });
  };

  return (
    <ResizableElement
      style={{
        color: "black",
        ...style,
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
      onResize={handleResize}
    >
      <div
        ref={elementRef}
        className="relative rounded shadow-sm"
        onMouseEnter={() => setShowDelete(true)}
        onMouseLeave={() => setShowDelete(false)}
      >
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={src}
              onChange={(e) => handleUpdate({ src: e.target.value })}
              placeholder="Image URL"
              className="p-1 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={alt}
              onChange={(e) => handleUpdate({ alt: e.target.value })}
              placeholder="Alt text"
              className="p-1 border border-gray-300 rounded"
            />
            <button
              onClick={() => setIsEditing(false)}
              className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            className="h-auto w-full"
            style={{
              ...style,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onDoubleClick={() => setIsEditing(true)}
          />
        )}
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
    </ResizableElement>
  );
};
