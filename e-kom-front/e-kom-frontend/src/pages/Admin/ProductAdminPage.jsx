import { useNavigate } from 'react-router-dom';

const ProductAdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Productos</h1>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <p className="text-yellow-800 text-lg font-semibold mb-4">
          ⚠️ Recursos de Productos Deprecados
        </p>
        <p className="text-yellow-700 mb-4">
          La funcionalidad de gestión de productos ha sido removida del sistema.
        </p>
        <p className="text-yellow-700 mb-6">
          Ahora, los productos se cargan directamente como parte de las publicaciones (posts).
          Los datos de precio, marca e imagen se ingresan directamente al crear una publicación.
        </p>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Volver al Panel de Admin
        </button>
      </div>
    </div>
  );
};

export default ProductAdminPage;
