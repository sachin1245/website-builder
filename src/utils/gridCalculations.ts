import { sortBy } from "lodash";
import {
  Element,
  TextElement,
  ImageElement,
  VideoElement,
  ButtonElement,
} from "@/types/Element";

export interface GridLayout {
  columns: string;
  rows: string;
  areas: { [key: string]: string };
}

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

// Function to extract unique positions
const extractUniquePositions = (
  elements: PixelElement[],
  dimension: "left" | "top" | "width" | "height"
): number[] => {
  const positions = new Set<number>();
  positions.add(0);
  elements.forEach((element) => {
    const start = parseFloat(element.style[dimension] as string);
    const size = parseFloat(
      element.style[
        dimension === "left" || dimension === "top"
          ? dimension === "left"
            ? "width"
            : "height"
          : dimension
      ] as string
    );
    positions.add(start);
    positions.add(start + size);
  });
  positions.add(100);
  return Array.from(positions).sort((a, b) => a - b);
};

// Calculate grid layout for desktop view
export const calculateGridLayout = (elements: PixelElement[]): GridLayout => {
  const columns = extractUniquePositions(elements, "left");
  const rows = extractUniquePositions(elements, "top");

  const columnTemplate = columns
    .slice(1)
    .map((col, i) => `${col - columns[i]}fr`)
    .join(" ");

  const rowTemplate = rows
    .slice(1)
    .map((row, i) => `${row - rows[i]}fr`)
    .join(" ");

  const areas: { [key: string]: string } = {};
  elements.forEach((element) => {
    const left = parseFloat(element.style.left as string);
    const top = parseFloat(element.style.top as string);
    const width = parseFloat(element.style.width as string);
    const height = parseFloat(element.style.height as string);

    const columnStart = columns.findIndex((col) => col >= left) + 1;
    const columnEnd = columns.findIndex((col) => col >= left + width) + 1;
    const rowStart = rows.findIndex((row) => row >= top) + 1;
    const rowEnd = rows.findIndex((row) => row >= top + height) + 1;

    areas[
      element.id
    ] = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`;
  });

  return { columns: columnTemplate, rows: rowTemplate, areas };
};

export const calculateResponsiveLayout = (
  elements: PixelElement[],
  containerWidth: number
): GridLayout => {
  // Convert percentage widths to actual pixels for width calculations
  const pixelElements = elements.map((el) => ({
    ...el,
    pixelLeft: (parseFloat(el.style.left as string) / 100) * containerWidth,
    pixelWidth: (parseFloat(el.style.width as string) / 100) * containerWidth,
    pixelTop: parseFloat(el.style.top as string),
    pixelHeight: parseFloat(el.style.height as string),
  }));

  // Sort elements by their top position
  pixelElements.sort((a, b) => a.pixelTop - b.pixelTop);

  let columns: number[] = [0];
  let rows: number[] = [0];
  let areas: { [key: string]: string } = {};
  let maxHeight = 0;

  pixelElements.forEach((element) => {
    // For smaller screens, we'll stack elements vertically
    if (containerWidth <= 768) {
      const rowStart = rows.length;
      rows.push(rows[rows.length - 1] + element.pixelHeight);
      areas[element.id] = `${rowStart} / 1 / ${rowStart + 1} / 2`;
    } else {
      // For larger screens, maintain a layout similar to the desktop version
      const columnStart =
        columns.findIndex((col) => col >= element.pixelLeft) + 1;
      const columnEnd =
        columns.findIndex(
          (col) => col >= element.pixelLeft + element.pixelWidth
        ) + 1;
      const rowStart = rows.findIndex((row) => row >= element.pixelTop) + 1;
      const rowEnd =
        rows.findIndex((row) => row >= element.pixelTop + element.pixelHeight) +
        1;

      if (!columns.includes(element.pixelLeft)) columns.push(element.pixelLeft);
      if (!columns.includes(element.pixelLeft + element.pixelWidth))
        columns.push(element.pixelLeft + element.pixelWidth);
      if (!rows.includes(element.pixelTop)) rows.push(element.pixelTop);
      if (!rows.includes(element.pixelTop + element.pixelHeight))
        rows.push(element.pixelTop + element.pixelHeight);

      areas[
        element.id
      ] = `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`;
    }

    maxHeight = Math.max(maxHeight, element.pixelTop + element.pixelHeight);
  });

  // Ensure the last column extends to the container width and last row to maxHeight
  if (columns[columns.length - 1] < containerWidth)
    columns.push(containerWidth);
  if (rows[rows.length - 1] < maxHeight) rows.push(maxHeight);

  // Convert pixel values to fractional units (fr)
  const columnTemplate =
    containerWidth <= 768
      ? "1fr"
      : columns
          .slice(1)
          .map((col, i) => `${((col - columns[i]) / containerWidth) * 100}fr`)
          .join(" ");

  const rowTemplate = rows
    .slice(1)
    .map((row, i) => `${((row - rows[i]) / maxHeight) * 100}fr`)
    .join(" ");

  return { columns: columnTemplate, rows: rowTemplate, areas };
};

// Unified calculateGridArea function
export const calculateGridArea = (
  element: Element,
  layout: GridLayout
): string => {
  return layout.areas[element.id] || "auto";
};

export const groupAndSortElements = (
  elements: PixelElement[]
): PixelElement[][] => {
  console.log("groupAndSortElements function called");
  // Sort elements by top position first, then by left position
  const sortedElements = sortBy(elements, [
    "pixelStyle.top",
    "pixelStyle.left",
  ]);

  const groups: PixelElement[][] = [];
  let currentGroup: PixelElement[] = [];
  let lastTop = -1;

  sortedElements.forEach((element: PixelElement) => {
    if (Math.abs(element.pixelStyle.top - lastTop) > 50) {
      // Threshold for new row
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = [element];
    } else {
      currentGroup.push(element);
    }
    lastTop = element.pixelStyle.top;
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
};
