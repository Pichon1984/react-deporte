import { useState, useEffect } from "react";
import ProductoForm from "./ProductoForm";

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);

  // ✅ cargar productos
  const fetchProductos = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/productos", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // ✅ guardar producto con token
  const handleGuardar = async (producto) => {
    const token = localStorage.getItem("token");
    try {
      const url = producto._id
        ? `http://localhost:3000/api/productos/${producto._id}`
        : "http://localhost:3000/api/productos";

      const method = producto._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(producto),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchProductos(); // refrescar lista
      setProductoEditando(null);
    } catch (error) {
      console.error("Error guardando producto:", error);
    }
  };

  return (
    <div>
      <button onClick={() => setProductoEditando({})}>Nuevo Producto</button>

      {productoEditando && (
        <ProductoForm
          productoInicial={productoEditando}
          onGuardar={handleGuardar}
          onCancelar={() => setProductoEditando(null)}
        />
      )}

      {/* renderizar productos */}
    </div>
  );
};

export default AdminProductos;

