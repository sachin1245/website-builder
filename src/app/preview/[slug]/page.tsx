import React from "react";
import { PreviewMode } from "@/components/Preview/PreviewMode";

export default function PreviewPage({ params }: { params: { slug: string } }) {
  return <PreviewMode slug={params.slug} />;
}
