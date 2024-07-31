"use client";
import React, { useState, useEffect, useRef } from "react";
import { useBuilderContext } from "@/context/BuilderContext";
import {
  Element,
  Section,
  TextElement,
  ImageElement,
  VideoElement,
  ButtonElement,
} from "@/types/Element";
import Link from "next/link";
import {
  calculateGridLayout,
  calculateResponsiveLayout,
  calculateGridArea,
  GridLayout,
  groupAndSortElements,
} from "@/utils/gridCalculations";
import "./PreviewMode.css";

//used to
type PixelStyle = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type PixelElement = (
  | TextElement
  | ImageElement
  | VideoElement
  | ButtonElement
) & {
  pixelStyle: PixelStyle;
};

const BASE_WIDTH = 1440;
const BASE_HEIGHT = 768;

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
  const [pixelElements, setPixelElements] = useState<PixelElement[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentPage = pages.find((page) => page.slug === slug);

  const convertToPixels = (value: string, baseDimension: number): number => {
    const percentage = parseFloat(value);
    return (percentage / 100) * baseDimension;
  };

  // Calculate grid layouts for different device types
  useEffect(() => {
    if (currentPage) {
      //convert % values to pixels so we can set max-width and max-height
      const newPixelElements = currentPage.sections.flatMap((section) =>
        section.elements.map((element) => ({
          ...element,
          pixelStyle: {
            left: convertToPixels(element.style.left as string, BASE_WIDTH),
            top: convertToPixels(element.style.top as string, BASE_HEIGHT),
            width: convertToPixels(element.style.width as string, BASE_WIDTH),
            height: convertToPixels(
              element.style.height as string,
              BASE_HEIGHT
            ),
          },
        }))
      );

      setPixelElements(newPixelElements);

      const newSectionLayouts: {
        [key: string]: { [key: string]: GridLayout };
      } = {};

      currentPage.sections.forEach((section) => {
        // Calculate layouts for desktop, tablet, and mobile
        const sectionElements = newPixelElements.filter(
          (el) => el.sectionId === section.id
        );

        const desktopLayout = calculateGridLayout(sectionElements);
        const tabletLayout = calculateResponsiveLayout(sectionElements, 768);
        const mobileLayout = calculateResponsiveLayout(sectionElements, 375);

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

    const sectionPixelElements = pixelElements.filter(
      (element) => element.sectionId === section.id
    );

    const groupedElements = groupAndSortElements(sectionPixelElements);

    return (
      <div
        key={section.id}
        className="preview-grid preview-section"
        style={{ ...sectionStyle, ...gridStyle }}
      >
        {deviceType === "desktop"
          ? sectionPixelElements.map((element) =>
              renderElement(element, section.id)
            )
          : groupedElements.map((group, groupIndex) => (
              <div key={`group-${groupIndex}`} className="element-group">
                {group.map((element) => renderElement(element, section.id))}
              </div>
            ))}
      </div>
    );
  };

  // Render an individual element within a section
  const renderElement = (element: PixelElement, sectionId: string) => {
    const layout = sectionLayouts[sectionId]?.[deviceType];
    if (!layout) return null;

    const gridArea = layout.areas[element.id] || "auto";
    const styles: React.CSSProperties = {
      ...element.style,
      gridArea,
      position: "relative",
      left: undefined,
      top: undefined,
      width: "100%",
      height: "auto",
      maxWidth: `${element.pixelStyle.width}px`,
      maxHeight: `${element.pixelStyle.height}px`,
    };

    // Common props for all element types
    const commonProps = {
      className: `preview-element preview-element-${element.type}`,
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
        commonProps.className = `w-full p-2 h-full bg-blue-500 text-white rounded hover:bg-blue-600 ${commonProps.className}`;
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
        className={`preview-container preview-${deviceType}`}
        style={containerStyle}
      >
        {currentPage.sections.map(renderSection)}
      </div>
    </div>
  );
};
