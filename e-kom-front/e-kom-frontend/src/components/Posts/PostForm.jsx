import React, { useState, useEffect } from "react";
import { postsService } from "../../api/posts.service.js";
import { entitiesService } from "../../api/entities.service.js";

const initialFormState = {
  title: "",
  content: "",
  price: 0,
  brand: "",
  market_id: "",
  category_id: "",
};

const PostForm = ({ postToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");

  const [loadingEntities, setLoadingEntities] = useState(true);
  const [markets, setMarkets] = useState([]);
  const [categories, setCategories] = useState([]);
  

  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ============================
        CARGA INICIAL
  ============================= */
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const [marketData, categoryData] = await Promise.all([
          entitiesService.getAllMarkets(),
          entitiesService.getAllCategories(),
        ]);

        setMarkets(marketData);
        setCategories(categoryData);

        if (postToEdit) {
          setFormData({
            title: postToEdit.title || "",
            content: postToEdit.content || "",
            price: postToEdit.price || 0,
            brand: postToEdit.brand || "",
            market_id: postToEdit.market_id,
            category_id: postToEdit.category_id,
          });
        } else {
          setFormData((prev) => ({
            ...prev,
            market_id: marketData[0]?.id || "",
            category_id: categoryData[0]?.id || "",
          }));
        }
      } catch (err) {
        console.error("Error entidades:", err);
      }

      setLoadingEntities(false);
    };

    fetchEntities();
  }, [postToEdit]);

  /* ============================
        HANDLERS
  ============================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files?.[0] || null);
  };

  /* ============================
        SUBMIT
  ============================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      let res;

      if (postToEdit) {
        const payload = {
          ...formData,
          price: Number(formData.price),
          market_id: Number(formData.market_id),
          category_id: Number(formData.category_id),
        };

        res = await postsService.updatePost(postToEdit.id, payload);

        alert("Publicación actualizada.");
      } else {
        if (!imageFile) {
          setError("Debe seleccionar una imagen.");
          setSubmitting(false);
          return;
        }

        const fd = new FormData();
        fd.append("title", formData.title);
        fd.append("content", formData.content);
        fd.append("price", Number(formData.price));
        fd.append("brand", formData.brand);
        fd.append("market_id", Number(formData.market_id));
        fd.append("category_id", Number(formData.category_id));
        fd.append("image", imageFile);

        res = await postsService.createPost(fd);
        alert("Publicación creada.");
      }

      onSave?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Error al guardar."
      );
    }

    setSubmitting(false);
  };

  if (loadingEntities) return <p>Cargando opciones…</p>;

  return (
    <div className="postform-container">
      <form className="postform-card" onSubmit={handleSubmit}>
        <h2 className="postform-title">
          {postToEdit ? "Editar Publicación" : "Crear Publicación"}
        </h2>

        {error && <p className="postform-error">{error}</p>}

        {/* TITULO */}
        <div className="postform-group">
          <label>Título</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* DESCRIPCIÓN */}
        <div className="postform-group">
          <label>Descripción</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="3"
            required
          ></textarea>
        </div>

        {/* PRECIO + MARCA */}
        <div className="postform-row">
          <div className="postform-group">
            <label>Precio</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="postform-group">
            <label>Marca</label>
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* CATEGORIA + MARKET */}
        <div className="postform-row">
          <div className="postform-group">
            <label>Categoría</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              {categories.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="postform-group">
            <label>Local</label>
            <select
              name="market_id"
              value={formData.market_id}
              onChange={handleChange}
              required
            >
              {markets.map((m) => (
                <option value={m.id} key={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* OFERTA */}
        {/* Oferta opcional removida: ahora las ofertas se aplican solo desde el dueño del post */}

        {/* Oferta personalizada removida de creación/edición de posts. Las ofertas se aplican desde la publicación por su dueño. */}

        {/* IMAGEN */}
        {!postToEdit && (
          <div className="postform-group">
            <label>Imagen del Producto</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        )}

        {/* BOTONES */}
        <div className="postform-actions">
          <button type="button" className="btn-outline" onClick={onClose}>
            Cancelar
          </button>

          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? "Guardando..." : postToEdit ? "Guardar" : "Publicar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
