import React, { useState, useRef, useEffect } from "react";

interface ResizableElementProps {
  children: React.ReactNode;
  style: React.CSSProperties;
  onResize: (newStyle: React.CSSProperties) => void;
}

export const ResizableElement: React.FC<ResizableElementProps> = ({
  children,
  style,
  onResize,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ width: 0, height: 0 });

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      startSizeRef.current = { width: rect.width, height: rect.height };
    }
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleResize = (e: MouseEvent) => {
      if (!elementRef.current) return;
      const container = elementRef.current.closest(
        ".drag-drop-area"
      ) as HTMLElement;
      if (!container) return;

      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;

      const newWidth = startSizeRef.current.width + deltaX;
      const newHeight = startSizeRef.current.height + deltaY;

      const newWidthPercent = (newWidth / container.clientWidth) * 100;
      const newHeightPercent = (newHeight / container.clientHeight) * 100;

      const newStyle = {
        ...style,
        width: `${Math.max(5, Math.min(100, newWidthPercent))}%`,
        height: `${Math.max(5, Math.min(100, newHeightPercent))}%`,
      };

      onResize(newStyle);
    };

    const stopResize = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);

    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing, style, onResize]);

  return (
    <div
      ref={elementRef}
      style={{
        ...style,
        position: "absolute",
        boxSizing: "border-box",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "10px",
          height: "10px",
          background: "#4299e1",
          cursor: "se-resize",
        }}
        onMouseDown={startResize}
      />
    </div>
  );
};
