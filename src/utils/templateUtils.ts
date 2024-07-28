import { v4 as uuidv4 } from "uuid";

export const loadTemplates = (): any[] => {
  if (typeof window !== "undefined") {
    const templates = localStorage.getItem("templates");
    return templates ? JSON.parse(templates) : [];
  }
  return [];
};

export const saveTemplate = (page: any) => {
  if (typeof window !== "undefined") {
    const templates = loadTemplates();
    const newTemplate = {
      id: uuidv4(),
      page: page,
    };
    localStorage.setItem(
      "templates",
      JSON.stringify([...templates, newTemplate])
    );
  }
};
