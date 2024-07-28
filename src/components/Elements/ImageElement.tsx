import React, { useState, useRef } from "react";
import { useElementDrag } from "@/hooks/useElementDrag";
import { useBuilderContext } from "@/context/BuilderContext";
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
  const { updateElement, deleteElement, setSelectedElement } =
    useBuilderContext();

  const [showDelete, setShowDelete] = useState(false);

  const { isDragging, drag } = useElementDrag("image", { id, type: "image" });
  const elementRef = useRef<HTMLDivElement>(null);
  drag(elementRef);

  const handleResize = (newStyle: React.CSSProperties) => {
    updateElement(sectionId, {
      id,
      type: "image",
      src,
      alt,
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
          onClick={() =>
            setSelectedElement({
              id,
              src,
              alt,
              style,
              sectionId,
              type: "image",
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
