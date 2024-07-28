import React, { useState, useRef } from "react";
import { useElementDrag } from "@/hooks/useElementDrag";
import { useBuilderContext } from "@/context/BuilderContext";
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
  const { updateElement, deleteElement, setSelectedElement } =
    useBuilderContext();

  const [showDelete, setShowDelete] = useState(false);

  const { isDragging, drag } = useElementDrag("video", { id, type: "video" });
  const elementRef = useRef<HTMLDivElement>(null);
  drag(elementRef);

  const handleResize = (newStyle: React.CSSProperties) => {
    updateElement(sectionId, {
      id,
      type: "video",
      src,
      sectionId,
      style: newStyle,
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
        <video
          src={src}
          controls
          className="w-full h-full"
          onClick={() =>
            setSelectedElement({
              id,
              src,
              style,
              sectionId,
              type: "video",
            })
          }
        />
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
