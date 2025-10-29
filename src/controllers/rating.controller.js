import Rating from "../models/rating.model.js";
import {PostModel} from "../models/post.model.js";

export const ratePost = async (req, res) => {
  const { postId, score } = req.body;
  const userId = req.user.id;
  // Evita puntuaciones duplicadas
  let rating = await Rating.findOne({ where: { userId, postId } });
  if (rating) {
    rating.score = score;
    await rating.save();
  } else {
    rating = await Rating.create({ userId, postId, score });
  }
  res.json(rating);
};

export const getPostAverageRating = async (req, res) => {
  const { postId } = req.params;
  const ratings = await Rating.findAll({ where: { postId } });
  if (ratings.length === 0) return res.json({ average: 0 });
  const average = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
  res.json({ average });
};

export const getPostAvRating = async (req, res) => {
  const { postId } = req.params;
  const ratings = await Rating.findAll({ where: { postId } });
  if (ratings.length === 0) return res.json({ average: 0 });
  const average = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
  res.json({ average: Number(average.toFixed(2)) });
};

export const getUserAvRating = async (req, res) => {
  const { userId } = req.params;
  const posts = await Post.findAll({ where: { userId } });
  if (posts.length === 0) return res.json({ average: 0 });

  const postIds = posts.map(p => p.id);
  const ratings = await Rating.findAll({ where: { postId: postIds } });
  if (ratings.length === 0) return res.json({ average: 0 });

  const average = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;
  res.json({ average: Number(average.toFixed(2)) });
};