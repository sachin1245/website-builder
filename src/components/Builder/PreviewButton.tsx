"use client";

import { useRouter } from "next/navigation";
import { FaEye } from "react-icons/fa";

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
      className="flex items-center w-full px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-center "
    >
      <FaEye className="mr-2" /> Preview
    </button>
  );
};
