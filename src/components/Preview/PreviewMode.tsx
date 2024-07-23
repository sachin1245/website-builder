import React, { useState } from "react";
import { useBuilderContext } from "@/context/BuilderContext";
import { TextBlock } from "../Elements/TextElement";
import { ImageElement } from "../Elements/ImageElement";
import { VideoElement } from "../Elements/VideoElement";
import { ButtonElement } from "../Elements/ButtonElement";

const devices = ["desktop", "tablet", "mobile"] as const;
type Device = (typeof devices)[number];

export const PreviewMode: React.FC = () => {
  const { elements } = useBuilderContext();
  const [selectedDevice, setSelectedDevice] = useState<Device>("desktop");

  const deviceClasses: Record<Device, string> = {
    desktop: "w-full",
    tablet: "w-[768px]",
    mobile: "w-[375px]",
  };

  const renderElement = (element: any) => {
    switch (element.type) {
      case "text":
        return <TextBlock key={element.id} {...element} />;
      case "image":
        return <ImageElement key={element.id} {...element} />;
      case "video":
        return <VideoElement key={element.id} {...element} />;
      case "button":
        return <ButtonElement key={element.id} {...element} />;
      default:
        return null;
    }
  };

  return (
    <div className="preview-mode">
      <div className="mb-4">
        {devices.map((device) => (
          <button
            key={device}
            onClick={() => setSelectedDevice(device)}
            className={`mr-2 px-3 py-1 rounded ${
              selectedDevice === device
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {device}
          </button>
        ))}
      </div>
      <div
        className={`border ${deviceClasses[selectedDevice]} mx-auto bg-white min-h-[500px] relative border border-gray-300 overflow-hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4`}
      >
        {elements.map(renderElement)}
      </div>
    </div>
  );
};
