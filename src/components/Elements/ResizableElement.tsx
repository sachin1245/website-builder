import React, { useState, useRef, useEffect } from "react";

interface ResizableElementProps {
  children: React.ReactNode;
  style: React.CSSProperties;
  onResize: (width: number, height: number) => void;
}

export const ResizableElement: React.FC<ResizableElementProps> = ({
  children,
  style,
  onResize,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (!isResizing || !elementRef.current) return;

      const element = elementRef.current;
      const newWidth = Math.max(
        50,
        e.clientX - element.getBoundingClientRect().left
      );
      const newHeight = Math.max(
        50,
        e.clientY - element.getBoundingClientRect().top
      );

      onResize(newWidth, newHeight);
    };

    const stopResize = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", stopResize);
    }

    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing, onResize]);

  return (
    <div
      ref={elementRef}
      style={{
        ...style,
        position: "absolute",
        boxSizing: "border-box",
        border: "1px solid #ccc",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          right: "0",
          bottom: "0",
          width: "10px",
          height: "10px",
          background: "#4299e1",
          cursor: "se-resize",
          zIndex: 1000,
        }}
        onMouseDown={startResize}
      />
    </div>
  );
};
