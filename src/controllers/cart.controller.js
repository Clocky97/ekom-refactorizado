import CartModel from "../models/cart.model.js";
import { PostModel } from "../models/post.model.js";

// Get user's cart
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await CartModel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: PostModel,
          as: "post",
          attributes: ["id", "title", "price", "image"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Map to frontend format
    const mapped = cartItems.map((item) => ({
      id: item.post_id,
      title: item.post?.title || "Post no encontrado",
      price: item.post?.price || 0,
      image: item.post?.image || null,
      quantity: item.quantity,
    }));

    const total = mapped.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({ items: mapped, total });
  } catch (error) {
    console.error("getUserCart error:", error);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
};

// Add or update item in cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id, quantity = 1 } = req.body;

    if (!post_id) return res.status(400).json({ error: "post_id requerido" });

    // Check if post exists
    const post = await PostModel.findByPk(post_id);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });

    // Find existing cart item
    let cartItem = await CartModel.findOne({
      where: { user_id: userId, post_id },
    });

    if (cartItem) {
      // Update quantity
      cartItem.quantity += Number(quantity);
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await CartModel.create({
        user_id: userId,
        post_id,
        quantity: Number(quantity),
      });
    }

    // Return updated post with new quantity
    const result = {
      id: post.id,
      title: post.title,
      price: post.price,
      image: post.image,
      quantity: cartItem.quantity,
    };

    res.status(201).json({ message: "Agregado al carrito", item: result });
  } catch (error) {
    console.error("addToCart error:", error);
    res.status(500).json({ error: "Error al agregar al carrito" });
  }
};

// Update item quantity in cart
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1)
      return res.status(400).json({ error: "Cantidad inválida" });

    const cartItem = await CartModel.findOne({
      where: { user_id: userId, post_id },
    });

    if (!cartItem)
      return res.status(404).json({ error: "Producto no encontrado en carrito" });

    cartItem.quantity = Number(quantity);
    await cartItem.save();

    res.json({ message: "Cantidad actualizada", item: cartItem });
  } catch (error) {
    console.error("updateCartItem error:", error);
    res.status(500).json({ error: "Error al actualizar carrito" });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id } = req.params;

    const cartItem = await CartModel.findOne({
      where: { user_id: userId, post_id },
    });

    if (!cartItem)
      return res.status(404).json({ error: "Producto no encontrado en carrito" });

    await cartItem.destroy();

    res.json({ message: "Producto removido del carrito" });
  } catch (error) {
    console.error("removeFromCart error:", error);
    res.status(500).json({ error: "Error al remover del carrito" });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await CartModel.destroy({
      where: { user_id: userId },
    });

    res.json({ message: "Carrito vaciado" });
  } catch (error) {
    console.error("clearCart error:", error);
    res.status(500).json({ error: "Error al limpiar carrito" });
  }
};

export default {};
