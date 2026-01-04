import { useState, useEffect } from "react";
import ProductoForm from "../admin/ProductoForm";

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [cargando, setCargando] = useState(false);

  // ✅ cargar productos
  const fetchProductos = async () => {
    const token = localStorage.getItem("token");
    setCargando(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos`, {
        headers: {
          "x-token": token,
        },
      });
      const data = await res.json();
      setProductos(data.productos || data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // ✅ guardar producto (POST vs PUT)
  const handleGuardar = async (producto) => {
    const token = localStorage.getItem("token");
    try {
      const url = producto._id
        ? `${import.meta.env.VITE_API_URL}/api/productos/${producto._id}`
        : `${import.meta.env.VITE_API_URL}/api/productos`;

      const method = producto._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-token": token,
        },
        body: JSON.stringify(producto),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchProductos(); // refrescar lista
      setProductoEditando(null);
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert("No se pudo guardar el producto");
    }
  };

  // ✅ eliminar producto
  const handleEliminar = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/productos/${id}`, {
        method: "DELETE",
        headers: {
          "x-token": token,
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchProductos(); // refrescar lista
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert("No se pudo eliminar el producto");
    }
  };

  return (
    <div>
      <h2>Administrar Productos</h2>

      {/* Botón para nuevo producto */}
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
            cuotas: [],
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

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <ul>
          {productos.map((p) => (
            <li key={p._id}>
              <strong>{p.nombre}</strong> - ${p.precio}
              <br />
              <em>Categoría:</em> {p.categoria?.nombre || p.categoria} |{" "}
              <em>Stock:</em> {p.stock}
              <br />
              <em>Envío:</em> costo ${p.envio?.costo || 0}, tiempo{" "}
              {p.envio?.tiempo || 0} días, métodos:{" "}
              {(p.envio?.metodos || []).join(", ")}
              <br />
              <em>Cuotas:</em>{" "}
              {p.cuotas && p.cuotas.length > 0
                ? p.cuotas
                    .map(
                      (c) =>
                        c.recommended_message || `${c.cantidad}x${c.monto}`
                    )
                    .join(" | ")
                : "Sin cuotas"}
              <br />
              <button
                onClick={() =>
                  setProductoEditando({
                    ...p,
                    envio: p.envio || { costo: "", tiempo: "", metodos: [] },
                    cuotas: p.cuotas || [],
                  })
                }
              >
                Editar
              </button>
              <button onClick={() => handleEliminar(p._id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminProductos;
