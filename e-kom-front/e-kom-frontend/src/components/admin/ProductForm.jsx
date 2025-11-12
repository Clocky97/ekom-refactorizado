const ProductForm = ({ product = null, categories = [] }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <p className="text-yellow-800 text-lg font-semibold mb-4">
        ⚠️ Recursos de Productos Deprecados
      </p>
      <p className="text-yellow-700">
        Los productos ya no se gestionan de forma independiente.
        Los datos de producto (precio, marca, imagen) ahora se ingresan directamente en cada publicación (post).
      </p>
    </div>
  );
};

export default ProductForm;
