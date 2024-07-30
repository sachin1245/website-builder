export interface BaseElement {
  id: string;
  type: "text" | "image" | "video" | "button";
  style: React.CSSProperties;
  sectionId: string;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  alt: string;
}

export interface VideoElement extends BaseElement {
  type: "video";
  src: string;
}

export interface ButtonElement extends BaseElement {
  type: "button";
  content: string;
}

export type Element = TextElement | ImageElement | VideoElement | ButtonElement;

export interface Section {
  id: string;
  elements: Element[];
  background: {
    type: "color" | "image";
    value: string;
  };
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  sections: Section[];
}
