import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secreto";

//verificar si el usuario esta autenticado
export function auth(req, res, next) {
  const token = req.headers["authorization"];
  
  if (!token) {
    console.log('No token provided:', req.path);
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ error: "Formato de token inválido" });
    }

    const decoded = jwt.verify(tokenParts[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
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