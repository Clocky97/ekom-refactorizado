import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const CartPage = () => {
  const { items, remove, clear, total } = useCart();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Publicaciones Guardadas</h2>

      <div className="mb-4 text-lg font-semibold">${total.toFixed(2)}</div>

      {items.length === 0 ? (
        <p className="text-slate-600">No hay publicaciones guardadas.</p>
      ) : (
        <ul className="space-y-4">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.18 }}
                className="p-4 border rounded-md bg-white flex items-center gap-4"
              >
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                ) : (
                  <div className="w-20 h-20 bg-slate-100 rounded" />
                )}

                <div className="flex-1">
                  <div className="font-semibold text-slate-800">{item.title}</div>
                  <div className="text-sm text-slate-600">{item.brand}</div>
                  <div className="text-sm text-slate-700 font-bold mt-1">${Number(item.price).toFixed(2)}</div>
                </div>

                <div className="flex flex-col gap-2">
                  <button onClick={() => remove(item.id)} className="px-3 py-1 bg-red-600 text-white rounded">Quitar</button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <div className="mt-6">
        <button onClick={() => clear()} className="px-4 py-2 bg-red-600 text-white rounded">Vaciar carrito</button>
      </div>
    </div>
  );
};

export default CartPage;
