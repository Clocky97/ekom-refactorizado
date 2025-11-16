import React from "react";
import { useCart } from "../../context/CartContext.jsx";

export default function CartSidebar({ open, onClose }) {
  const { cart, increase, decrease, removeFromCart, clearCart, cartTotal } = useCart();

  const handleClearCart = async () => {
    if (window.confirm("¿Estás seguro de que deseas limpiar el carrito?")) {
      try {
        await clearCart();
        alert("Carrito vaciado correctamente");
      } catch (error) {
        alert("Error al limpiar el carrito");
      }
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      alert("Error al remover producto del carrito");
    }
  };

  const handleIncrease = async (id) => {
    try {
      await increase(id);
    } catch (error) {
      alert("Error al aumentar cantidad");
    }
  };

  const handleDecrease = async (id) => {
    try {
      await decrease(id);
    } catch (error) {
      alert("Error al disminuir cantidad");
    }
  };

  return (
    <>
      {/* Fondo oscuro */}
      {open && <div className="cart-backdrop" onClick={onClose}></div>}

      {/* Sidebar */}
      <div className={`cart-sidebar ${open ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Carrito 🛒</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Lista de productos */}
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty">No hay productos en el carrito.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">

                {/* Imagen */}
                {item.image && (
                  <img src={item.image} alt={item.title} className="cart-img" />
                )}

                <div className="cart-info">
                  <h3>{item.title}</h3>
                  <p className="price">${item.price}</p>

                  {/* Subtotal */}
                  <p className="subtotal">
                    Subtotal: <strong>${item.price * item.quantity}</strong>
                  </p>

                  {/* Controles de cantidad */}
                  <div className="quantity">
                    <button onClick={() => handleDecrease(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncrease(item.id)}>+</button>
                  </div>
                </div>

                {/* Botón eliminar */}
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.id)}
                  title="Eliminar producto"
                >
                  🗑️
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
          
          {cart.length > 0 && (
            <button
              className="btn-outline"
              onClick={handleClearCart}
              style={{
                width: "100%",
                marginTop: "0.5rem",
                background: "#ff6b6b",
                color: "white",
                border: "none",
              }}
            >
              Limpiar carrito
            </button>
          )}
        </div>
      </div>
    </>
  );
}
