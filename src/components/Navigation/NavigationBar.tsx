import React, { useState } from "react";
import Link from "next/link";
import { useBuilderContext } from "@/context/BuilderContext";
import { saveTemplate } from "@/utils/templateUtils";
import { useRouter } from "next/navigation";
import {
  FaUndo,
  FaRedo,
  FaSave,
  FaFolderOpen,
  FaEye,
  FaBars,
} from "react-icons/fa";

export const NavigationBar: React.FC = () => {
  const { currentPageId, pages, undo, redo, canUndo, canRedo } =
    useBuilderContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const currentPage = pages.find((page) => page.id === currentPageId);

  const handleSaveTemplate = () => {
    if (currentPage) {
      saveTemplate(currentPage);
      alert("Template saved successfully!");
    } else {
      alert("No page selected to save as template.");
    }
  };

  const handlePreviewClick = () => {
    if (currentPage) {
      router.push(`/preview/${currentPage.slug}`);
    }
  };

  const navItems = [
    { icon: <FaUndo />, action: undo, disabled: !canUndo, label: "Undo" },
    { icon: <FaRedo />, action: redo, disabled: !canRedo, label: "Redo" },
    { icon: <FaSave />, action: handleSaveTemplate, label: "Save Template" },
    { icon: <FaFolderOpen />, href: "/load-template", label: "Load Template" },
    { icon: <FaEye />, action: handlePreviewClick, label: "Preview" },
  ];

  return (
    <nav className="bg-gray-900 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Website Builder</div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white"
          >
            <FaBars size={24} />
          </button>
        </div>
        <div
          className={`flex md:space-x-2 space-x-4 justify-center items-center overflow-x-auto pb-2 ${
            isMenuOpen
              ? "fixed top-16 left-0 right-0 bg-gray-900 p-4"
              : "hidden md:flex"
          }`}
        >
          {navItems.map((item, index) =>
            item.href ? (
              <Link
                key={index}
                href={item.href}
                className="flex items-center px-3 py-2 bg-green-500 rounded hover:bg-green-600 transition-colors whitespace-nowrap"
              >
                {item.icon}
                <span className="hidden md:inline ml-2">{item.label}</span>
              </Link>
            ) : (
              <button
                key={index}
                onClick={item.action}
                disabled={item.disabled}
                className={`flex items-center px-3 py-2 rounded transition-colors whitespace-nowrap ${
                  item.disabled
                    ? "bg-gray-500 cursor-not-allowed"
                    : item.label === "Undo" || item.label === "Redo"
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : item.label === "Save Template"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                {item.icon}
                <span className="hidden md:inline ml-2">{item.label}</span>
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
};
