"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Builder } from "@/components/Builder/Builder";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <DndProvider backend={HTML5Backend}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl text-black font-bold mb-6">
            Website Builder
          </h1>
          <Builder />
        </div>
      </DndProvider>
    </main>
  );
}
