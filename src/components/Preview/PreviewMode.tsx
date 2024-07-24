"use client";
import React, { useState, useEffect, useRef } from "react";
import { useBuilderContext } from "@/context/BuilderContext";
import { Element, Section } from "@/types/Element";
import Link from "next/link";

interface PreviewModeProps {
  slug: string;
}

export const PreviewMode: React.FC<PreviewModeProps> = ({ slug }) => {
  const { pages } = useBuilderContext();
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const currentPage = pages.find((page) => page.slug === slug);

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, []);

  if (!currentPage) return <div>Page not found</div>;

  const generateResponsiveStyles = (element: Element) => {
    const { width } = containerSize;
    const elementWidth = parseFloat(element.style.width as string) || 0;
    const elementLeft = parseFloat(element.style.left as string) || 0;

    // Adjust positions for mobile view
    if (
      (deviceType === "mobile" && elementLeft + elementWidth > width) ||
      (deviceType === "tablet" && elementLeft + elementWidth > 768)
    ) {
      return {
        position: "absolute",
        top: `${
          parseFloat(element.style.top as string) +
          parseFloat(element.style.height as string) +
          10
        }px`,
        left: "10px",
        width: `${elementWidth}px`,
        height: element.style.height,
        ...element.style,
      };
    }
    return {
      position: "absolute",
      top: element.style.top,
      left: element.style.left,
      width: element.style.width,
      height: element.style.height,
      ...element.style,
    };
  };

  const renderElement = (element: Element) => {
    const styles = generateResponsiveStyles(element);

    switch (element.type) {
      case "text":
        return (
          <p key={element.id} className="element" style={styles}>
            {element.content}
          </p>
        );
      case "image":
        return (
          <img
            key={element.id}
            src={element.src}
            alt={element.alt}
            className="element"
            style={styles}
          />
        );
      case "video":
        return (
          <video
            key={element.id}
            src={element.src}
            controls
            className="element"
            style={styles}
          />
        );
      case "button":
        return (
          <button key={element.id} className="element" style={styles}>
            {element.content}
          </button>
        );
      default:
        return null;
    }
  };

  const renderSection = (section: Section) => (
    <div key={section.id} className="preview-section">
      {section.elements.map(renderElement)}
    </div>
  );

  const containerStyle = {
    width:
      deviceType === "mobile"
        ? "375px"
        : deviceType === "tablet"
        ? "768px"
        : "100%",
    margin: deviceType !== "desktop" ? "0 auto" : "0",
  };

  return (
    <div className="preview-mode">
      <div className="bg-gray-100 p-4 shadow-md sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">{currentPage.name}</h1>
          <div className="flex flex-wrap gap-2">
            {["mobile", "tablet", "desktop"].map((type) => (
              <button
                key={type}
                onClick={() =>
                  setDeviceType(type as "mobile" | "tablet" | "desktop")
                }
                className={`px-3 py-1 text-sm rounded ${
                  deviceType === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } transition-colors`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
            <Link
              href="/"
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Back to Editor
            </Link>
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        className="preview-container"
        style={containerStyle}
      >
        {currentPage.sections.map(renderSection)}
      </div>
    </div>
  );
};
