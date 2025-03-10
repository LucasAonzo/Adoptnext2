"use client";

import { useState, createContext, useContext } from "react";
import { createPortal } from "react-dom";

export type ToastVariant = "default" | "destructive" | "success";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {}
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...props, id }]);

    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, props.duration || 5000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-0 right-0 p-6 z-50 flex flex-col gap-2 max-w-md w-full">
          {toasts.map((toast) => (
            <div 
              key={toast.id} 
              className={`
                bg-white border rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out 
                ${toast.variant === 'destructive' ? 'border-red-600' : 
                  toast.variant === 'success' ? 'border-green-600' : 'border-adopt-purple-200'}
              `}
            >
              {toast.title && (
                <h3 className={`text-lg font-semibold mb-1 
                  ${toast.variant === 'destructive' ? 'text-red-700' : 
                    toast.variant === 'success' ? 'text-green-700' : 'text-adopt-gray-900'}
                `}>
                  {toast.title}
                </h3>
              )}
              {toast.description && (
                <p className="text-adopt-gray-600">{toast.description}</p>
              )}
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="absolute top-2 right-2 text-adopt-gray-400 hover:text-adopt-gray-600"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export const toast = (props: ToastProps) => {
  if (typeof window !== 'undefined') {
    // This is a simple implementation for direct usage without context
    // Create and append a temporary toast
    const div = document.createElement('div');
    div.className = `fixed bottom-6 right-6 z-50 max-w-md w-full bg-white border rounded-lg shadow-lg p-4 
      ${props.variant === 'destructive' ? 'border-red-600' : 
        props.variant === 'success' ? 'border-green-600' : 'border-adopt-purple-200'}`;
    
    const innerHTML = `
      ${props.title ? `<h3 class="text-lg font-semibold mb-1 
        ${props.variant === 'destructive' ? 'text-red-700' : 
          props.variant === 'success' ? 'text-green-700' : 'text-adopt-gray-900'}">
        ${props.title}
      </h3>` : ''}
      ${props.description ? `<p class="text-adopt-gray-600">${props.description}</p>` : ''}
    `;
    
    div.innerHTML = innerHTML;
    document.body.appendChild(div);
    
    // Remove after duration
    setTimeout(() => {
      if (document.body.contains(div)) {
        document.body.removeChild(div);
      }
    }, props.duration || 5000);
  }
};