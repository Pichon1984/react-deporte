import { useState, useEffect } from "react";
import ProductoForm from "../admin/ProductoForm";

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);

  // ✅ cargar productos
  const fetchProductos = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/productos", {
        headers: {
          "x-token": token // 👈 usamos x-token
        }
      });
      const data = await res.json();
      // ajusta según tu backend: puede devolver { productos: [...] } o directamente un array
      setProductos(data.productos || data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // ✅ guardar producto con x-token (POST vs PUT)
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
          "x-token": token // 👈 usamos x-token
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
      {/* Botón para nuevo producto con envio/cuotas inicializados */}
      <button
        onClick={() =>
          setProductoEditando({
            nombre: "",
            precio: "",
            categoria: "",
            stock: "",
            descripcion: "",
            tallesTexto: "",
            imagenes: [],
            envio: { costo: "", tiempo: "", metodos: [] },
            cuotas: []
          })
        }
      >
        Nuevo Producto
      </button>

      {productoEditando && (
        <ProductoForm
          productoInicial={productoEditando}
          onGuardar={handleGuardar}
          onCancelar={() => setProductoEditando(null)}
        />
      )}

      {/* renderizar productos */}
      <ul>
        {productos.map((p) => (
          <li key={p._id}>
            <strong>{p.nombre}</strong> - ${p.precio}
            <br />
            <em>Categoría:</em> {p.categoria?.nombre || p.categoria} | <em>Stock:</em> {p.stock}
            <br />
            <em>Envío:</em> costo ${p.envio?.costo || 0}, tiempo {p.envio?.tiempo || 0} días, métodos: {(p.envio?.metodos || []).join(", ")}
            <br />
            <em>Cuotas:</em>{" "}
            {p.cuotas && p.cuotas.length > 0
              ? p.cuotas.map((c, i) => c.recommended_message || `${c.cantidad}x${c.monto}`).join(" | ")
              : "Sin cuotas"}
            <br />
            <button
              onClick={() =>
                setProductoEditando({
                  ...p,
                  envio: p.envio || { costo: "", tiempo: "", metodos: [] },
                  cuotas: p.cuotas || []
                })
              }
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductos;

