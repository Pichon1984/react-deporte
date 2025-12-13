import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import FiltroProductos from "../components/admin/FiltroProductos";
import ListaProductosAdmin from "../components/admin/ListaProductosAdmin";
import ProductoModal from "../components/admin/ProductoModal";
import AdminUsuarios from "../components/admin/AdminUsuarios";

const Admin = () => {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: "", categoria: "", talle: "" });
  const [productoActual, setProductoActual] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ cargar productos desde backend con token
  useEffect(() => {
    const fetchProductos = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("⚠️ No hay token en localStorage, inicia sesión primero");
        return;
      }
      try {
        const res = await fetch("http://localhost:3000/api/productos", {
          headers: {
            "x-token": token
          }
        });
        const data = await res.json();
        const productosArray = Array.isArray(data) ? data : data.productos || [];
        setProductos(productosArray);
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };
    fetchProductos();
  }, []);

  // ✅ guardar producto con token
  const handleGuardar = async (producto) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token en localStorage, inicia sesión primero");
      return;
    }

    try {
      let res;
      if (producto._id) {
        res = await fetch(`http://localhost:3000/api/productos/${producto._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-token": token
          },
          body: JSON.stringify(producto),
        });
      } else {
        res = await fetch("http://localhost:3000/api/productos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-token": token
          },
          body: JSON.stringify(producto),
        });
      }

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();

      setProductos((prev) =>
        producto._id
          ? prev.map((p) => (p._id === producto._id ? data : p))
          : [...prev, data]
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error guardando producto:", error);
    }
  };

  // ✅ eliminar producto con token
  const handleEliminar = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No hay token en localStorage, inicia sesión primero");
      return;
    }

    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
        method: "DELETE",
        headers: {
          "x-token": token
        }
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      setProductos((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };

  // ✅ filtros
  const productosFiltrados = productos.filter((p) => {
    const coincideNombre = filtros.nombre
      ? p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
      : true;
    const coincideCategoria = filtros.categoria
      ? (p.categoria?.nombre || p.categoria || "").toLowerCase().includes(filtros.categoria.toLowerCase())
      : true;
    const coincideTalle = filtros.talle
      ? p.talles?.some((t) => t.toLowerCase().includes(filtros.talle.toLowerCase()))
      : true;
    return coincideNombre && coincideCategoria && coincideTalle;
  });

  return (
    <div className="container mt-4">
      <h2>Panel de Administración</h2>

      <Button
        className="mt-2"
        onClick={() => {
          setProductoActual({
            nombre: "",
            precio: "",
            categoria: "",
            stock: "",
            descripcion: "",
            imagenes: [],
            talles: [],
          });
          setShowModal(true);
        }}
      >
        Nuevo Producto
      </Button>

      <FiltroProductos filtros={filtros} setFiltros={setFiltros} />
      <ListaProductosAdmin
        productos={productosFiltrados}
        onEditar={(p) => {
          setProductoActual(p);
          setShowModal(true);
        }}
        onEliminar={handleEliminar}
      />

      <ProductoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        producto={productoActual}
        onGuardar={handleGuardar}
      />

      <AdminUsuarios />
    </div>
  );
};

export default Admin;

