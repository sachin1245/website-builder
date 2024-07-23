import React from "react";
import Link from "next/link";
import { useBuilderContext } from "@/context/BuilderContext";

export const NavigationBar: React.FC = () => {
  const { pages, currentPage, setCurrentPage } = useBuilderContext();

  return (
    <nav className="flex space-x-4 mb-4">
      {pages.map((page: any) => (
        <Link
          key={page.id}
          href={`#${page.id}`}
          onClick={() => setCurrentPage(page.id)}
          className={`px-3 py-2 rounded ${
            currentPage === page.id ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {page.name}
        </Link>
      ))}
    </nav>
  );
};
