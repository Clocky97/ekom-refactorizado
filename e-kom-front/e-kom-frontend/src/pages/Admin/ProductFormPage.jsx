import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../api/products.service';
import { entitiesService } from '../../api/entities.service';
import ProductForm from '../../components/admin/ProductForm';
import { useToast } from '../../context/ToastContext';

const ProductFormPage = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar categorías
        const categoriesData = await entitiesService.getAllCategories();
        setCategories(categoriesData);

        // Si estamos en modo edición, cargar el producto
        if (id) {
          const productData = await getProductById(id);
          setProduct(productData);
        }
      } catch (error) {
        showToast(error.message || 'Error al cargar los datos', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center p-4">Cargando datos...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? 'Editar Producto' : 'Crear Nuevo Producto'}
      </h1>
      <ProductForm
        product={product}
        categories={categories}
      />
    </div>
  );
};

export default ProductFormPage;