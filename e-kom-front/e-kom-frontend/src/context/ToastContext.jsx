import React, { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

// Thin wrapper so existing code using push/showToast works
export const ToastProvider = ({ children }) => {
  const push = (message, { type = 'info', timeout = 4000 } = {}) => {
    const options = { duration: timeout };
    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'loading':
        toast.loading(message, options);
        break;
      default:
        toast(message, options);
    }
  };

  const remove = (id) => {
    // react-hot-toast dismiss accepts id or nothing
    try { toast.dismiss(id); } catch (e) { /* ignore */ }
  };

  const showToast = (message, type = 'info', timeout = 4000) => push(message, { type, timeout });

  return (
    <ToastContext.Provider value={{ push, remove, showToast }}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#0f172a',
            boxShadow: '0 8px 30px rgba(2,6,23,0.12)'
          },
          success: {
            style: { background: '#ecfdf5', color: '#064e3b' }
          },
          error: {
            style: { background: '#fff1f2', color: '#7f1d1d' }
          }
        }}
      />
    </ToastContext.Provider>
  );
};

export default ToastContext;
