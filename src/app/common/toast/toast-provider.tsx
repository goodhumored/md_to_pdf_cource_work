"use client"

import React from "react";
import Toast from "./toast";

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

interface Toast {
  id: string;
  message: string;
  isError: boolean;
  duration: number;
}

export interface ToastContextType {
  showToast: (message: string, isError?: boolean, duration?: number) => void;
  removeToast: (id: string) => void;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = (message: string, isError: boolean = false, duration: number = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, isError, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-110 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            isError={toast.isError}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
