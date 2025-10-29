import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secreto";

//verificar si el usuario esta autenticado
export function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

//verificar si el usuario es admin
export function admin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acceso solo para admin" });
  }
  next();
}