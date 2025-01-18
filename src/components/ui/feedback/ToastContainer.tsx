import { useState, useCallback } from 'react';
import { Toast, ToastType } from './Toast';

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  let toastId = 0;

  const show = useCallback((type: ToastType, message: string) => {
    const id = toastId++;
    setToasts(current => [...current, { id, type, message }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);

  return {
    toasts,
    show,
    remove,
    success: (message: string) => show('success', message),
    error: (message: string) => show('error', message),
    info: (message: string) => show('info', message),
  };
}

export function ToastContainer() {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => remove(toast.id)}
        />
      ))}
    </div>
  );
}