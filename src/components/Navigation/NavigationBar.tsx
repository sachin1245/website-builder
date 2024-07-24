import React from "react";
import Link from "next/link";
import { useBuilderContext } from "@/context/BuilderContext";

export const NavigationBar: React.FC = () => {
  const { pages, currentPageId, setCurrentPage } = useBuilderContext();

  return (
    <nav className="flex flex-wrap space-x-2 space-y-2 mb-4">
      {pages.map((page) => (
        <Link
          key={page.id}
          href={`/builder/${page.slug}`}
          onClick={() => setCurrentPage(page.id)}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            currentPageId === page.id
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {page.name}
        </Link>
      ))}
    </nav>
  );
};
