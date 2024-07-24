export interface BaseElement {
  id: string;
  type: "text" | "image" | "video" | "button";
  style: React.CSSProperties;
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
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  sections: Section[];
}
