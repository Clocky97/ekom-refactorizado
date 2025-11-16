import PostOffer from "../models/postOffer.model.js";
import { PostModel } from "../models/post.model.js";
import User from "../models/user.model.js";
import { Op } from 'sequelize';

export const createPostOffer = async (req, res) => {
  try {
    const { post_id, amount } = req.body;
    const user_id = req.user.id;

    if (!post_id || !amount) return res.status(400).json({ error: 'post_id y amount son requeridos' });
    const post = await PostModel.findByPk(post_id);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });
    if (post.user_id === user_id) return res.status(400).json({ error: 'No puedes ofertar en tu propio post' });

    const created = await PostOffer.create({ post_id, amount, user_id });
    res.status(201).json(created);
  } catch (error) {
    console.error('createPostOffer error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getOffersByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const offers = await PostOffer.findAll({
      where: { post_id: postId },
      include: [
        { association: 'user', attributes: ['id', 'username'] }
      ],
      order: [['amount', 'DESC']]
    });
    res.json(offers);
  } catch (error) {
    console.error('getOffersByPost error:', error);
    res.status(500).json({ error: 'Error al obtener ofertas' });
  }
};

export const getFeaturedOffers = async (req, res) => {
  try {
    // Fetch pending PostOffer entries
    const offers = await PostOffer.findAll({
      where: { status: 'pending' },
      include: [
        { association: 'post', attributes: ['id', 'title', 'image', 'user_id'] },
        { association: 'user', attributes: ['id', 'username'] }
      ],
      order: [['amount', 'DESC']],
      limit: 5
    });

    // Additionally include posts that have a custom_offer_percent >= 40
    const postsWithCustomOffer = await PostModel.findAll({
      where: { custom_offer_percent: { [Op.gte]: 40 } },
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['id', 'username']
        }
      ]
    });

    // Map posts with custom offers to a shape similar to PostOffer so frontend can display them
    const customOffersMapped = postsWithCustomOffer.map((p) => {
      const post = p.toJSON ? p.toJSON() : p;
      const percent = Number(post.custom_offer_percent) || 0;
      const price = Number(post.price) || 0;
      const amount = Number((price * (percent / 100)).toFixed(2));
      return {
        id: `custom-post-${post.id}`,
        amount,
        status: 'custom',
        post: {
          id: post.id,
          title: post.title,
          image: post.image,
          user_id: post.user_id
        },
        user: post.usuario ? { id: post.usuario.id, username: post.usuario.username } : null,
        custom_offer_percent: percent
      };
    });

    // Combine and sort by amount desc, limit to 5 results
    const combined = [...offers.map(o => o.toJSON ? o.toJSON() : o), ...customOffersMapped];
    combined.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
    const top = combined.slice(0, 5);
    res.json(top);
  } catch (error) {
    console.error('getFeaturedOffers error:', error);
    res.status(500).json({ error: 'Error al obtener ofertas destacadas' });
  }
};

// Dev helper: seed some example offers for testing (no auth)
export const createSeedOffers = async (req, res) => {
  try {
    const posts = await PostModel.findAll({ limit: 10 });
    if (!posts || posts.length === 0) return res.status(400).json({ error: 'No hay posts para crear ofertas' });

    const seed = [];
    for (let i = 0; i < Math.min(5, posts.length); i++) {
      const p = posts[i];
      const amount = Math.floor(Math.random() * 500) + 50; // random between 50 and 549
      const created = await PostOffer.create({ post_id: p.id, amount, user_id: 1 + (i % 3) });
      seed.push(created);
    }

    res.json({ created: seed.length, seed });
  } catch (error) {
    console.error('createSeedOffers error:', error);
    res.status(500).json({ error: 'Error al crear seed' });
  }
};

export const updateOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // expected 'accepted' | 'rejected'
    const offer = await PostOffer.findByPk(id, { include: [{ association: 'post' }] });
    if (!offer) return res.status(404).json({ error: 'Oferta no encontrada' });

    // Only post owner or admin can change status
    const post = offer.post;
    const userId = req.user.id;
    const role = req.user.role;
    if (!(role === 'admin' || post.user_id === userId)) {
      return res.status(403).json({ error: 'No autorizado para modificar esta oferta' });
    }

    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    offer.status = status;
    await offer.save();
    res.json(offer);
  } catch (error) {
    console.error('updateOfferStatus error:', error);
    res.status(500).json({ error: 'Error al actualizar oferta' });
  }
};

// Owner applies a percent discount to their post (owner or admin only)
export const applyOwnerOffer = async (req, res) => {
  try {
    const { postId } = req.params;
    const { percent } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    if (!percent || isNaN(Number(percent))) return res.status(400).json({ error: 'Percent inválido' });
    const p = Number(percent);
    if (p < 1 || p > 100) return res.status(400).json({ error: 'Percent debe estar entre 1 y 100' });

    const post = await PostModel.findByPk(postId);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    if (!(role === 'admin' || post.user_id === userId)) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Calculate new price after discount. Price is expected to be integer (currency units)
    const originalPrice = Number(post.price) || 0;
    const discounted = Math.round(originalPrice * (1 - p / 100));

    post.custom_offer_percent = p;
    post.price = discounted;
    await post.save();

    // Return updated post (normalized shape as in post controller)
    const result = post.toJSON ? post.toJSON() : post;
    res.json({ message: 'Oferta aplicada', post: result });
  } catch (error) {
    console.error('applyOwnerOffer error:', error);
    res.status(500).json({ error: 'Error aplicando oferta' });
  }
};

// Owner removes the discount they applied to their post (owner or admin only)
export const removeOwnerOffer = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const post = await PostModel.findByPk(postId);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    if (!(role === 'admin' || post.user_id === userId)) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Remove custom offer: set percent to null and reset price to original
    // Since we don't store original_price yet, we need to calculate it from the current discount
    // If custom_offer_percent is X, original = current / (1 - X/100)
    if (post.custom_offer_percent) {
      const currentPrice = Number(post.price) || 0;
      const percent = Number(post.custom_offer_percent) || 0;
      const originalPrice = percent > 0 ? Math.round(currentPrice / (1 - percent / 100)) : currentPrice;
      post.price = originalPrice;
    }

    post.custom_offer_percent = null;
    await post.save();

    const result = post.toJSON ? post.toJSON() : post;
    res.json({ message: 'Oferta removida', post: result });
  } catch (error) {
    console.error('removeOwnerOffer error:', error);
    res.status(500).json({ error: 'Error removiendo oferta' });
  }
};

export default {};
