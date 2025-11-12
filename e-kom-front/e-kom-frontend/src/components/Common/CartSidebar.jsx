import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext.jsx';

const CartSidebar = () => {
  const { items, remove, clear, total, open, setOpen } = useCart();

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: 320, opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05 },
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            // use very large z-index to ensure overlay sits above other app elements
            className="fixed inset-0 bg-black/30 z-[9999]"
          />
          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            // ensure sidebar is on top of header and all page content
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[10000]"
          >
            <motion.div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold">Publicaciones Guardadas</h3>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-green-600">${total.toFixed(2)}</span>
                <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-700 text-xl transition">✖</button>
              </div>
            </motion.div>
            <div className="p-4 overflow-y-auto h-[calc(100%-160px)]">
              {items.length === 0 ? (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-600">
                  No hay publicaciones guardadas.
                </motion.p>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {items.map((item, i) => (
                      <motion.li
                        key={item.id}
                        custom={i}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="p-3 border rounded-md bg-slate-50 flex items-start gap-3"
                      >
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <div className="w-16 h-16 bg-slate-200 rounded" />
                        )}
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">{item.title}</div>
                          <div className="text-sm text-slate-600">{item.brand}</div>
                          <div className="text-sm text-slate-700 font-bold mt-1">${Number(item.price).toFixed(2)}</div>
                        </div>
                        <div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => remove(item.id)}
                            className="text-red-600 font-semibold text-sm hover:text-red-700 transition"
                          >
                            Quitar
                          </motion.button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
            <motion.div className="p-4 border-t border-slate-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { clear(); }}
                className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Vaciar carrito
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
