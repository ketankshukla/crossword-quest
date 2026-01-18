"use client";

import { useEffect, useState } from "react";
import type { ToastMessage } from "@/lib/types";

interface ToastProps {
  message: ToastMessage;
  onDismiss: (id: string) => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(message.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message.id, onDismiss]);

  const bgColor = {
    success: "from-green-500 to-emerald-600",
    error: "from-red-500 to-rose-600",
    info: "from-blue-500 to-cyan-600",
  }[message.type];

  const icon = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  }[message.type];

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r ${bgColor} text-white shadow-lg animate-slideIn`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{message.message}</span>
      <button
        onClick={() => onDismiss(message.id)}
        className="ml-2 hover:opacity-80 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}

interface ToastContainerProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ messages, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {messages.map((message) => (
        <Toast key={message.id} message={message} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export function useToast() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage["type"], message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setMessages((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  return {
    messages,
    addToast,
    dismissToast,
    success: (message: string) => addToast("success", message),
    error: (message: string) => addToast("error", message),
    info: (message: string) => addToast("info", message),
  };
}
