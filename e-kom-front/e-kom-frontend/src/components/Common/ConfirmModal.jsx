import React from 'react';

const ConfirmModal = ({ open, title = 'Confirmar', message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar' }) => {
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70 }}>
      <div style={{ background: 'white', padding: 20, borderRadius: 8, width: 360 }}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ color: '#444' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button onClick={onCancel} style={{ padding: '8px 12px' }}>{cancelText}</button>
          <button onClick={onConfirm} style={{ padding: '8px 12px', background: '#dc2626', color: 'white', borderRadius: 6 }}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
