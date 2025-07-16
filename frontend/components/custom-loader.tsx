import React, { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type CustomLoaderProps = {
  message?: string;
};

export function CustomLoader({ message = "Loading..." }: CustomLoaderProps) {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Set a timer to hide the loader after a random time between 20–30 seconds
    const duration = Math.floor(Math.random() * 10000) + 20000; // 20000ms to 30000ms
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, duration);

    return () => clearTimeout(timer); // cleanup
  }, []);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32">
          <DotLottieReact
            src="https://lottie.host/fffe0a5b-965a-4069-b011-64f20a45f2eb/W6e4gktQqZ.lottie"
            loop
            autoplay
          />
        </div>
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
