import React, { useState } from "react";
import { useBuilderContext } from "@/context/BuilderContext";
import { useElementDrag } from "@/hooks/useElementDrag";

interface VideoElementProps {
  id: string;
  src: string;
  style: React.CSSProperties;
}

export const VideoElement: React.FC<VideoElementProps> = ({
  id,
  src,
  style,
}) => {
  const { updateElement, deleteElement } = useBuilderContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { isDragging, drag } = useElementDrag("video", { id, type: "video" });

  const elementRef = React.useRef<HTMLDivElement>(null);

  // Connect the drag ref to element ref
  drag(elementRef);

  const handleDoubleClick = () => setIsEditing(true);
  const handleBlur = () => setIsEditing(false);

  const handleSrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateElement({ id, type: "video", src: e.target.value, style });
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
        <input
          type="text"
          value={src}
          onChange={handleSrcChange}
          onBlur={handleBlur}
          placeholder="Video URL"
          className="w-full p-1 border border-gray-300 rounded text-black"
          autoFocus
        />
      ) : (
        <video
          src={src}
          controls
          className="w-full h-full"
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
