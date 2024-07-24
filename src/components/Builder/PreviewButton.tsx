"use client";

import { useRouter } from "next/navigation";

interface PreviewButtonProps {
  slug: string | undefined;
}

export const PreviewButton: React.FC<PreviewButtonProps> = ({ slug }) => {
  const router = useRouter();

  const handlePreviewClick = () => {
    if (slug) {
      router.push(`/preview/${slug}`);
    }
  };

  return (
    <button
      onClick={handlePreviewClick}
      className="block w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-center mt-2"
    >
      Preview
    </button>
  );
};
