import React from "react";
import { Element, Section, Page } from "@/types/Element";

interface StaticModeProps {
  page: Page;
}

export const StaticMode: React.FC<StaticModeProps> = ({ page }) => {
  const renderElement = (element: Element) => {
    const styles = {
      ...element.style,
      position: "absolute" as const,
    };

    switch (element.type) {
      case "text":
        return (
          <p key={element.id} style={styles}>
            {element.content}
          </p>
        );
      case "image":
        return (
          <img
            key={element.id}
            src={element.src}
            alt={element.alt || ""}
            style={styles}
          />
        );
      case "video":
        return (
          <video key={element.id} src={element.src} controls style={styles} />
        );
      case "button":
        return (
          <button key={element.id} style={styles}>
            {element.content}
          </button>
        );
      default:
        return null;
    }
  };

  const renderSection = (section: Section) => (
    <div
      key={section.id}
      className="static-section"
      style={{ position: "relative", minHeight: "100px" }}
    >
      {section.elements.map(renderElement)}
    </div>
  );

  return (
    <div className="static-page">
      <h1>{page.name}</h1>
      {page.sections.map(renderSection)}
    </div>
  );
};
