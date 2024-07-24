import React, { useState, useRef } from "react";
import { useElementDrag } from "@/hooks/useElementDrag";
import { useBuilderContext } from "@/context/BuilderContext";
import { StyleEditor } from "./StyleEditor";
import { ResizableElement } from "./ResizableElement";

interface VideoElementProps {
  id: string;
  src: string;
  style: React.CSSProperties;
  sectionId: string;
}

export const VideoElement: React.FC<VideoElementProps> = ({
  id,
  src,
  style,
  sectionId,
}) => {
  const { updateElement, deleteElement } = useBuilderContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showStyleEditor, setShowStyleEditor] = useState(false);

  const { isDragging, drag } = useElementDrag("video", { id, type: "video" });
  const elementRef = useRef<HTMLDivElement>(null);
  drag(elementRef);

  const handleUpdate = (updates: Partial<VideoElementProps>) => {
    updateElement(sectionId, { id, type: "video", src, style, ...updates });
  };

  const handleResize = (width: number, height: number) => {
    handleUpdate({
      style: { ...style, width: `${width}px`, height: `${height}px` },
    });
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
              placeholder="Video URL"
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
          <video
            src={src}
            controls
            className="w-full h-full"
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
