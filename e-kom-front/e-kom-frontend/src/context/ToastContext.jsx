import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

let idCounter = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, { type = 'info', timeout = 3000 } = {}) => {
    const id = idCounter++;
    setToasts(t => [...t, { id, message, type }]);
    if (timeout > 0) setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), timeout);
    return id;
  }, []);

  const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div style={{ position: 'fixed', right: 16, top: 16, zIndex: 60 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ marginBottom: 8, minWidth: 240, padding: '10px 14px', borderRadius: 8, color: '#042', background: t.type === 'error' ? '#fee' : t.type === 'success' ? '#e6ffef' : '#eef2ff', boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
            <strong style={{ display: 'block', marginBottom: 4 }}>{t.type === 'error' ? 'Error' : t.type === 'success' ? 'OK' : 'Info'}</strong>
            <div style={{ fontSize: 13 }}>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;
