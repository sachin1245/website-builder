import { Element } from "@/types/Element";

export interface GridLayout {
  columns: string;
  rows: string;
}

const extractUniquePositions = (
  elements: Element[],
  dimension: "left" | "top" | "width" | "height"
) => {
  const positions = new Set<number>();
  positions.add(0);
  elements.forEach((element) => {
    const start = parseFloat(element.style[dimension] as string);
    const size = parseFloat(
      element.style[dimension === "left" ? "width" : "height"] as string
    );
    positions.add(start);
    positions.add(start + size);
  });
  positions.add(100);
  return Array.from(positions).sort((a, b) => a - b);
};

const generateTemplateValues = (positions: number[]) => {
  return positions.slice(1).map((pos, index) => pos - positions[index]);
};

const normalizeValues = (values: number[]) => {
  const sum = values.reduce((acc, val) => acc + val, 0);
  return values.map((val) => (val / sum) * 100);
};

export const calculateGridLayout = (elements: Element[]): GridLayout => {
  const columns = extractUniquePositions(elements, "left");
  const rows = extractUniquePositions(elements, "top");

  const columnTemplate = normalizeValues(generateTemplateValues(columns))
    .map((val) => `${val}fr`)
    .join(" ");

  const rowTemplate = normalizeValues(generateTemplateValues(rows))
    .map((val) => `${val}fr`)
    .join(" ");

  return { columns: columnTemplate, rows: rowTemplate };
};

export const calculateResponsiveLayout = (
  elements: Element[],
  containerWidth: number
): GridLayout => {
  // Convert percentage widths to actual pixels
  const pixelElements = elements.map((el) => ({
    ...el,
    pixelLeft: (parseFloat(el.style.left as string) / 100) * containerWidth,
    pixelWidth: (parseFloat(el.style.width as string) / 100) * containerWidth,
    pixelTop: parseFloat(el.style.top as string),
    pixelHeight: parseFloat(el.style.height as string),
  }));

  // Sort elements by their top position
  pixelElements.sort((a, b) => a.pixelTop - b.pixelTop);

  let rows: number[] = [0];
  let columns: number[] = [0];
  let currentRowElements: typeof pixelElements = [];
  let currentRowBottom = 0;

  pixelElements.forEach((element) => {
    if (element.pixelTop >= currentRowBottom) {
      // Process previous row
      if (currentRowElements.length > 0) {
        processRow(currentRowElements, containerWidth, rows, columns);
      }
      // Start new row
      currentRowElements = [element];
      currentRowBottom = element.pixelTop + element.pixelHeight;
    } else {
      currentRowElements.push(element);
      currentRowBottom = Math.max(
        currentRowBottom,
        element.pixelTop + element.pixelHeight
      );
    }
  });

  // Process last row
  if (currentRowElements.length > 0) {
    processRow(currentRowElements, containerWidth, rows, columns);
  }

  // Remove duplicates and sort
  columns = Array.from(new Set(columns)).sort((a, b) => a - b);

  // Generate template strings
  const columnTemplate = columns
    .slice(1)
    .map((col, i) => `${((col - columns[i]) / containerWidth) * 100}fr`)
    .join(" ");

  const rowTemplate = rows
    .slice(1)
    .map((row, i) => `${row - rows[i]}fr`)
    .join(" ");

  return { columns: columnTemplate, rows: rowTemplate };
};

const processRow = (
  rowElements: ReturnType<typeof calculateResponsiveLayout>["pixelElements"],
  containerWidth: number,
  rows: number[],
  columns: number[]
) => {
  let currentX = 0;
  rowElements.sort((a, b) => a.pixelLeft - b.pixelLeft);

  rowElements.forEach((element) => {
    if (currentX + element.pixelWidth > containerWidth) {
      // Element doesn't fit, move to next "row" (but really just extending the current row)
      currentX = 0;
      rows.push(rows[rows.length - 1] + element.pixelHeight);
    }
    columns.push(currentX);
    currentX += element.pixelWidth;
    columns.push(currentX);
  });

  // Add the height of this row
  const rowHeight = Math.max(...rowElements.map((el) => el.pixelHeight));
  rows.push(rows[rows.length - 1] + rowHeight);
};

export const calculateGridArea = (
  element: Element,
  layout: GridLayout
): string => {
  const left = parseFloat(element.style.left as string);
  const top = parseFloat(element.style.top as string);
  const width = parseFloat(element.style.width as string);
  const height = parseFloat(element.style.height as string);

  const columns = layout.columns.split(" ").map((fr) => parseFloat(fr));
  const rows = layout.rows.split(" ").map((fr) => parseFloat(fr));

  const columnStart =
    columns.findIndex((col, index) => {
      const position = columns
        .slice(0, index)
        .reduce((sum, curr) => sum + curr, 0);
      return position >= left;
    }) + 1;
  const columnEnd =
    columns.findIndex((col, index) => {
      const position = columns
        .slice(0, index)
        .reduce((sum, curr) => sum + curr, 0);
      return position >= left + width;
    }) + 1;
  const rowStart =
    rows.findIndex((row, index) => {
      const position = rows
        .slice(0, index)
        .reduce((sum, curr) => sum + curr, 0);
      return position >= top;
    }) + 1;
  const rowEnd =
    rows.findIndex((row, index) => {
      const position = rows
        .slice(0, index)
        .reduce((sum, curr) => sum + curr, 0);
      return position >= top + height;
    }) + 1;

  return `${rowStart} / ${columnStart} / ${rowEnd} / ${columnEnd}`;
};
