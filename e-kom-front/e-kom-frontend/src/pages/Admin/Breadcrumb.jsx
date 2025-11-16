import { Link } from "react-router-dom";
import "./Breadcrumb.css";

export default function Breadcrumb() {
  return (
    <nav className="breadcrumb">
      <Link to="/admin/categories">Categorías</Link>
      <span>/</span>
      <Link to="/admin/markets">Locales</Link>
      <span>/</span>
      <Link to="/admin/products">Comercios</Link>
      <span>/</span>
      <Link to="/admin/products">Productos</Link>
    </nav>
  );
}
