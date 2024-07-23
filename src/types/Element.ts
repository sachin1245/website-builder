export interface Element {
  id: string;
  type: "text" | "image" | "video" | "button";
  content?: string;
  src?: string;
  alt?: string;
  style: React.CSSProperties;
}
