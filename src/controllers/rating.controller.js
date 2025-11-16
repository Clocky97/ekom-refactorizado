import Rating from "../models/rating.model.js";
import { PostModel } from "../models/post.model.js";
import { Op } from "sequelize";
import { sequelize } from "../config/database.js";

export const ratePost = async (req, res) => {
  // Debug incoming headers
  console.log('ratePost - Authorization header:', req.headers.authorization);
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
  try {
    // Use SQL aggregation to compute the average score of ratings belonging to posts of the user
    const result = await Rating.findOne({
      attributes: [[sequelize.fn("AVG", sequelize.col("score")), "average"]],
      include: [
        {
          model: PostModel,
          where: { user_id: userId },
          attributes: [],
        },
      ],
      raw: true,
    });

    const avg = result && result.average ? Number(Number(result.average).toFixed(2)) : 0;
    res.json({ average: avg });
  } catch (error) {
    console.error("Error en getUserAvRating:", error);
    res.status(500).json({ error: "Error al calcular promedio de ratings" });
  }
};