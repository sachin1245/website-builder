"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBuilderContext } from "@/context/BuilderContext";

export const LoadTemplate: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const { loadTemplate } = useBuilderContext();
  const router = useRouter();

  useEffect(() => {
    const savedTemplates = JSON.parse(
      localStorage.getItem("templates") || "[]"
    );
    setTemplates(savedTemplates);
  }, []);

  const handleLoadTemplate = (templateId: string) => {
    loadTemplate(templateId);
    router.push("/");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Load Template</h1>
      <ul className="space-y-2">
        {templates.map((template) => (
          <li key={template.id} className="border p-2 rounded">
            <span>{template.id}</span>
            <button
              onClick={() => handleLoadTemplate(template.id)}
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
