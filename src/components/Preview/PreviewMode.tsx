"use client";
import React, { useState, useEffect, useRef } from "react";
import { useBuilderContext } from "@/context/BuilderContext";
import { Element, Section } from "@/types/Element";
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
  const [sectionLayouts, setSectionLayouts] = useState<{
    [key: string]: { [key: string]: GridLayout };
  }>({});

  const containerRef = useRef<HTMLDivElement>(null);

  const currentPage = pages.find((page) => page.slug === slug);

  // Calculate grid layouts for different device types
  useEffect(() => {
    if (currentPage) {
      const newSectionLayouts: {
        [key: string]: { [key: string]: GridLayout };
      } = {};

      currentPage.sections.forEach((section) => {
        // Calculate layouts for desktop, tablet, and mobile
        const desktopLayout = calculateGridLayout(section.elements);
        const tabletLayout = calculateResponsiveLayout(section.elements, 768);
        const mobileLayout = calculateResponsiveLayout(section.elements, 375);

        newSectionLayouts[section.id] = {
          desktop: desktopLayout,
          tablet: tabletLayout,
          mobile: mobileLayout,
        };
      });

      setSectionLayouts(newSectionLayouts);
    }
  }, [currentPage]);

  // Update CSS variables for responsive grid layout
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

  // Render a section with its elements
  const renderSection = (section: Section) => {
    const sectionStyle: React.CSSProperties = {
      ...(section.background.type === "color"
        ? { backgroundColor: section.background.value }
        : {
            backgroundImage: `url(${section.background.value})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }),
    };

    const layout = sectionLayouts[section.id]?.[deviceType];

    const gridStyle: React.CSSProperties = layout
      ? {
          display: "grid",
          gridTemplateColumns: layout.columns,
          gridTemplateRows: layout.rows,
        }
      : {};

    return (
      <div
        key={section.id}
        className="preview-grid preview-section"
        style={{ ...sectionStyle, ...gridStyle }}
      >
        {section.elements.map((element) => renderElement(element, section.id))}
      </div>
    );
  };

  // Render an individual element within a section
  const renderElement = (element: Element, sectionId: string) => {
    const layout = sectionLayouts[sectionId]?.[deviceType];
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

    // Common props for all element types
    const commonProps = {
      className: "preview-element",
      style: styles,
    };

    switch (element.type) {
      case "text":
        return (
          <p key={element.id} {...commonProps}>
            {element.content}
          </p>
        );
      case "image":
        return (
          <img
            key={element.id}
            {...commonProps}
            src={element.src}
            alt={element.alt}
          />
        );
      case "video":
        return (
          <video key={element.id} {...commonProps} src={element.src} controls />
        );
      case "button":
        return (
          <button key={element.id} {...commonProps}>
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
        {currentPage.sections.map(renderSection)}
      </div>
    </div>
  );
};
