import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

const LOCAL_KEY = 'ekom_cart_v1';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(items)); } catch (e) {}
  }, [items]);

  const add = useCallback((post) => {
    setItems(prev => {
      if (prev.find(p => p.id === post.id)) return prev;
      return [...prev, post];
    });
  }, []);

  const remove = useCallback((postId) => {
    setItems(prev => prev.filter(p => p.id !== postId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const isInCart = useCallback((postId) => items.some(p => p.id === postId), [items]);

  const total = items.reduce((s, p) => s + (Number(p.price) || 0), 0);

  return (
    <CartContext.Provider value={{ items, add, remove, clear, isInCart, total, open, setOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
