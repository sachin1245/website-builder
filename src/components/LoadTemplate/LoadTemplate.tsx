"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBuilderContext } from "@/context/BuilderContext";
import { loadTemplates } from "@/utils/templateUtils";

export const LoadTemplate: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const { addPage, setCurrentPage } = useBuilderContext();
  const router = useRouter();

  useEffect(() => {
    const loadedTemplates = loadTemplates();
    setTemplates(loadedTemplates);
  }, []);

  const handleLoadTemplate = (template: any) => {
    const newPage = addPage({
      name: `${template.page.name} (Copy)`,
      slug: `${template.page.slug}-${Date.now()}`,
      sections: template.page.sections,
    });
    setCurrentPage(newPage.id);
    router.push("/");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Load Template</h1>
      <ul className="space-y-2">
        {templates.map((template) => (
          <li key={template.id} className="border p-2 rounded">
            <span>{template.page.name}</span>
            <button
              onClick={() => handleLoadTemplate(template)}
              className="ml-4 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Load
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
