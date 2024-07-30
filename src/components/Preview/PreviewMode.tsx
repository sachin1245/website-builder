// src/components/PreviewMode.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useBuilderContext } from "@/context/BuilderContext";
import { Element } from "@/types/Element";
import Link from "next/link";
import {
  calculateGridLayout,
  calculateResponsiveLayout,
  calculateGridArea,
  GridLayout,
} from "@/utils/gridCalculations";
import "./PreviewMode.css";

interface PreviewModeProps {
  slug: string;
}

export const PreviewMode: React.FC<PreviewModeProps> = ({ slug }) => {
  const { pages } = useBuilderContext();
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const [gridLayouts, setGridLayouts] = useState<{ [key: string]: GridLayout }>(
    {}
  );
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPage = pages.find((page) => page.slug === slug);

  useEffect(() => {
    if (currentPage) {
      const elements = currentPage.sections.flatMap(
        (section) => section.elements
      );
      const desktopLayout = calculateGridLayout(elements);
      const tabletLayout = calculateResponsiveLayout(elements, 768);
      const mobileLayout = calculateResponsiveLayout(elements, 375);

      setGridLayouts({
        desktop: desktopLayout,
        tablet: tabletLayout,
        mobile: mobileLayout,
      });

      updateCSSVariables(desktopLayout, tabletLayout, mobileLayout);
    }
  }, [currentPage]);

  const updateCSSVariables = (
    desktop: GridLayout,
    tablet: GridLayout,
    mobile: GridLayout
  ) => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--grid-columns-desktop",
        desktop.columns
      );
      containerRef.current.style.setProperty(
        "--grid-rows-desktop",
        desktop.rows
      );
      containerRef.current.style.setProperty(
        "--grid-columns-tablet",
        tablet.columns
      );
      containerRef.current.style.setProperty("--grid-rows-tablet", tablet.rows);
      containerRef.current.style.setProperty(
        "--grid-columns-mobile",
        mobile.columns
      );
      containerRef.current.style.setProperty("--grid-rows-mobile", mobile.rows);
    }
  };

  const renderElement = (element: Element) => {
    const layout = gridLayouts[deviceType];
    if (!layout) return null;

    const gridArea = calculateGridArea(element, layout);
    const styles = {
      ...element.style,
      gridArea,
      position: "relative" as const,
      left: undefined,
      top: undefined,
      width: "100%",
      height: "100%",
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

  if (!currentPage) return <div>Page not found</div>;
  console.log(gridLayouts);

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
        <div className="preview-grid">
          {currentPage.sections.flatMap((section) =>
            section.elements.map(renderElement)
          )}
        </div>
      </div>
    </div>
  );
};
