import { createContext, useContext, useState, useEffect } from "react";
import { cartService } from "../api/cart.service.js";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from database on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const response = await cartService.getCart();
        if (response.items) {
          setCart(response.items);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        // Silently fail - user might not be authenticated
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const addToCart = async (post) => {
    try {
      await cartService.addToCart(post.id, 1);
      setCart((current) => {
        const exists = current.find((item) => item.id === post.id);
        if (exists) {
          return current.map((item) =>
            item.id === post.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...current, { ...post, quantity: 1 }];
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const increase = async (id) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    try {
      await cartService.updateCartItem(id, item.quantity + 1);
      setCart((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } catch (error) {
      console.error("Error increasing quantity:", error);
      throw error;
    }
  };

  const decrease = async (id) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    if (item.quantity <= 1) {
      // Remove item instead
      await removeFromCart(id);
      return;
    }

    try {
      await cartService.updateCartItem(id, item.quantity - 1);
      setCart((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      throw error;
    }
  };

  const removeFromCart = async (id) => {
    try {
      await cartService.removeFromCart(id);
      setCart((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isInCart = (id) => {
    return cart.some((item) => item.id === id);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increase,
        decrease,
        removeFromCart,
        clearCart,
        cartTotal,
        isInCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
