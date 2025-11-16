import React from "react";
import { useCart } from "../../context/CartContext.jsx";

export default function CartSidebar({ open, onClose }) {
  const { cart, addToCart, removeOne, removeFromCart, cartTotal } = useCart();

  return (
    <>
      {/* Fondo oscuro */}
      {open && <div className="cart-backdrop" onClick={onClose}></div>}

      {/* Sidebar */}
      <div className={`cart-sidebar ${open ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Guardados</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Lista de productos */}
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty">No hay productos guardados.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">

                {/* Imagen */}
                {item.image && (
                  <img src={item.image} alt="" className="cart-img" />
                )}

                <div className="cart-info">
                  <h3>{item.title}</h3>
                  <p className="price">${item.price}</p>

                  {/* Controles de cantidad */}
                  <div className="quantity">
                    <button onClick={() => removeOne(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>

                {/* Botón eliminar */}
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="cart-footer">
          <p className="total">
            Total: <strong>${cartTotal}</strong>
          </p>
        </div>
      </div>
    </>
  );
}
