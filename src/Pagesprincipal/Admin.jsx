import { useState, useEffect } from "react";
import { Button, Alert, Container, Row, Col } from "react-bootstrap";
import FiltroProductos from "../components/admin/FiltroProductos";
import ListaProductosAdmin from "../components/admin/ListaProductosAdmin";
import ProductoModal from "../components/admin/ProductoModal";
import AdminUsuarios from "../components/admin/AdminUsuarios";
import AdminConsultas from "../components/admin/AdminConsultas";
import AdminCompras from "../components/admin/AdminCompras";

const Admin = () => {
  const [seccion, setSeccion] = useState("productos");
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: "", categoria: "", talle: "" });
  const [productoActual, setProductoActual] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3000/api/productos", {
          headers: { "x-token": token }
        });
        const data = await res.json();
        const productosArray = Array.isArray(data) ? data : data.productos || [];
        setProductos(productosArray);
        setMensaje({ tipo: "success", texto: "Productos cargados correctamente" });
      } catch (error) {
        setMensaje({ tipo: "danger", texto: "Error cargando productos" });
      }
    };
    fetchProductos();
  }, []);

  const handleGuardar = async (producto) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      let res;
      if (producto._id) {
        res = await fetch(`http://localhost:3000/api/productos/${producto._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "x-token": token },
          body: JSON.stringify(producto),
        });
      } else {
        res = await fetch("http://localhost:3000/api/productos", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-token": token },
          body: JSON.stringify(producto),
        });
      }
      const data = await res.json();
      const productoGuardado = data.producto || data;
      setProductos((prev) =>
        producto._id
          ? prev.map((p) => (p._id === producto._id ? productoGuardado : p))
          : [...prev, productoGuardado]
      );
      setShowModal(false);
      setMensaje({ tipo: "success", texto: "Producto guardado correctamente" });
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error guardando producto" });
    }
  };

  const handleEliminar = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/productos/${id}`, {
        method: "DELETE",
        headers: { "x-token": token }
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setProductos((prev) => prev.filter((p) => p._id !== id));
      setMensaje({ tipo: "success", texto: "Producto eliminado correctamente" });
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error eliminando producto" });
    }
  };

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
    <Container fluid className="mt-4">
      <h2 className="mb-3">Panel de Administración</h2>

      {mensaje && (
        <Alert
          variant={mensaje.tipo}
          onClose={() => setMensaje(null)}
          dismissible
        >
          {mensaje.texto}
        </Alert>
      )}

      <Row>
        {/* Sidebar */}
        <Col xs={12} md={3} className="mb-3">
          <div className="d-flex flex-wrap flex-md-column gap-2">
            <Button
              variant={seccion === "productos" ? "primary" : "outline-primary"}
              onClick={() => setSeccion("productos")}
              className="w-100"
            >
              Productos
            </Button>
            <Button
              variant={seccion === "usuarios" ? "primary" : "outline-primary"}
              onClick={() => setSeccion("usuarios")}
              className="w-100"
            >
              Usuarios
            </Button>
            <Button
              variant={seccion === "consultas" ? "primary" : "outline-primary"}
              onClick={() => setSeccion("consultas")}
              className="w-100"
            >
              Consultas
            </Button>
            <Button
              variant={seccion === "compras" ? "primary" : "outline-primary"}
              onClick={() => setSeccion("compras")}
              className="w-100"
            >
              Compras
            </Button>
          </div>
        </Col>

        {/* Contenido */}
        <Col xs={12} md={9}>
          {seccion === "productos" && (
            <>
              <Button
                className="mt-2 mb-3"
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

              <div className="table-responsive mt-3">
                <ListaProductosAdmin
                  productos={productosFiltrados}
                  onEditar={(p) => {
                    setProductoActual(p);
                    setShowModal(true);
                  }}
                  onEliminar={handleEliminar}
                />
              </div>

              <ProductoModal
                show={showModal}
                onHide={() => setShowModal(false)}
                producto={productoActual}
                onGuardar={handleGuardar}
              />
            </>
          )}

          {seccion === "usuarios" && (
            <div className="table-responsive">
              <AdminUsuarios />
            </div>
          )}

          {seccion === "consultas" && (
            <div className="table-responsive">
              <AdminConsultas />
            </div>
          )}

          {seccion === "compras" && (
            <div className="table-responsive">
              <AdminCompras />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;

