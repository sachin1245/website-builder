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
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPage = pages.find((page) => page.slug === slug);

  // Update container size on mount and on window resize
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

  // Extract unique positions from the element styles for columns and rows
  const extractUniquePositions = (
    elements: Element[],
    dimension: "left" | "top" | "width" | "height"
  ) => {
    const positions = new Set<number>();
    elements.forEach((element) => {
      const start = parseFloat(element.style[dimension] as string);
      const size = parseFloat(
        element.style[dimension === "left" ? "width" : "height"] as string
      );
      positions.add(start);
      if (dimension === "left" || dimension === "top") {
        positions.add(start + size);
      }
    });
    return Array.from(positions).sort((a, b) => a - b);
  };

  // Generate template values by calculating differences between consecutive positions
  const generateTemplateValues = (positions: number[]) => {
    const values = [];
    for (let i = 1; i < positions.length; i++) {
      values.push(positions[i] - positions[i - 1]);
    }
    return values;
  };

  // Normalize template values so they add up to 100%
  const normalizeValues = (values: number[]) => {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return values.map((val) => (val / sum) * 100);
  };

  // Extract and normalize column positions
  const columns = extractUniquePositions(
    currentPage.sections.flatMap((section) => section.elements),
    "left"
  );
  const columnTemplate = normalizeValues(generateTemplateValues(columns))
    .map((val) => `${val}%`)
    .join(" ");

  // Extract and normalize row positions
  const rows = extractUniquePositions(
    currentPage.sections.flatMap((section) => section.elements),
    "top"
  );
  const rowTemplate = normalizeValues(generateTemplateValues(rows))
    .map((val) => `${val}%`)
    .join(" ");

  // Calculate grid area for each element
  const calculateGridArea = (element: Element) => {
    const left = parseFloat(element.style.left as string);
    const top = parseFloat(element.style.top as string);
    const width = parseFloat(element.style.width as string);
    const height = parseFloat(element.style.height as string);

    const columnStart = columns.indexOf(left) + 1;
    const columnEnd = columns.indexOf(left + width) + 1;
    const rowStart = rows.indexOf(top) + 1;
    const rowEnd = rows.indexOf(top + height) + 1;

    return `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`;
  };

  // Render each element based on its type
  const renderElement = (element: Element) => {
    const gridArea = calculateGridArea(element);

    const styles = {
      ...element.style,
      gridArea,
      position: "relative" as const,
      left: undefined,
      top: undefined,
      width: "100%",
      height: "100%",
      maxWidth: "100%",
      maxHeight: "100%",
      overflow: "hidden",
    };

    switch (element.type) {
      case "text":
        return (
          <p key={element.id} className="preview-element" style={styles}>
            {element.content}
          </p>
        );
      case "image":
        return (
          <img
            key={element.id}
            src={element.src}
            alt={element.alt}
            className="preview-element"
            style={styles}
          />
        );
      case "video":
        return (
          <video
            key={element.id}
            src={element.src}
            controls
            className="preview-element"
            style={styles}
          />
        );
      case "button":
        return (
          <button key={element.id} className="preview-element" style={styles}>
            {element.content}
          </button>
        );
      default:
        return null;
    }
  };

  // Define container styles based on device type
  const containerStyle = {
    width:
      deviceType === "mobile"
        ? "375px"
        : deviceType === "tablet"
        ? "768px"
        : "100%",
    height: deviceType === "desktop" ? "100%" : "auto",
    margin: deviceType !== "desktop" ? "0 auto" : "0",
    overflow: "auto",
    border: deviceType !== "desktop" ? "1px solid #ccc" : "none",
  };

  return (
    <div className="preview-mode">
      <div className="bg-gray-100 p-4 shadow-md sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl text-black font-bold">{currentPage.name}</h1>
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
        <div
          className="preview-grid"
          style={{
            display: "grid",
            gridTemplateColumns: columnTemplate,
            gridTemplateRows: rowTemplate,
            gap: "0",
            padding: "20px",
          }}
        >
          {currentPage.sections.flatMap((section) =>
            section.elements.map(renderElement)
          )}
        </div>
      </div>
    </div>
  );
};
