"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  onClose: () => void;
};

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto-close in 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-slide-in">
        {message}
      </div>
    </div>
  );
}
