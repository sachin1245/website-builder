import React from "react";
import { BuilderProvider } from "@/context/BuilderContext";
import "./globals.css";

export const metadata = {
  title: "Website Builder",
  description: "Build your own website with our drag-and-drop builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BuilderProvider>{children}</BuilderProvider>
      </body>
    </html>
  );
}
