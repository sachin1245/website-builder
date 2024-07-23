import React, { useState } from "react";
import { useBuilderContext } from "@/context/BuilderContext";
import { useElementDrag } from "@/hooks/useElementDrag";

interface ImageElementProps {
  id: string;
  src: string;
  alt: string;
  style: React.CSSProperties;
}

export const ImageElement: React.FC<ImageElementProps> = ({
  id,
  src,
  alt,
  style,
}) => {
  const { updateElement, deleteElement } = useBuilderContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { isDragging, drag } = useElementDrag("image", { id, type: "image" });
  const elementRef = React.useRef<HTMLDivElement>(null);

  drag(elementRef);

  const handleDoubleClick = () => setIsEditing(true);
  const handleBlur = () => setIsEditing(false);

  const handleSrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateElement({ id, type: "image", src: e.target.value, alt, style });
  };

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateElement({ id, type: "image", src, alt: e.target.value, style });
  };

  return (
    <div
      ref={elementRef}
      style={{ ...style, cursor: "move", opacity: isDragging ? 0.5 : 1 }}
      className="relative p-2 bg-white border border-gray-300 rounded shadow-sm"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {isEditing ? (
        <div className="flex flex-col gap-2" onBlur={handleBlur}>
          <input
            type="text"
            value={src}
            onChange={handleSrcChange}
            placeholder="Image URL"
            className="w-full p-1 border border-gray-300 rounded text-black"
            autoFocus
          />
          <input
            type="text"
            value={alt}
            onChange={handleAltChange}
            placeholder="Alt text"
            className="w-full p-1 border border-gray-300 rounded text-black"
          />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onDoubleClick={handleDoubleClick}
        />
      )}
      {showDelete && (
        <button
          onClick={() => deleteElement(id)}
          className="absolute -top-8 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      )}
    </div>
  );
};
