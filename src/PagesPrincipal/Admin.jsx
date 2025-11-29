import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import FiltroProductos from '../components/admin/FiltroProductos';
import ListaProductos from '../components/admin/ListaProductos';
import ProductoModal from '../components/admin/ProductoModal';
import AdminUsuarios from '../components/admin/AdminUsuarios';

const admin = () => {
  const [productos, setProductos] = useState(() => {
    const guardados = localStorage.getItem('productos'); // 🔁 clave unificada
    return guardados ? JSON.parse(guardados) : [];
  });

  const [filtros, setFiltros] = useState({ nombre: '', categoria: '', talle: '' });
  const [productoActual, setProductoActual] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('productos', JSON.stringify(productos)); // 🔁 clave unificada
  }, [productos]);

  const handleGuardar = (producto) => {
    setProductos(prev =>
      prev.some(p => p.id === producto.id)
        ? prev.map(p => (p.id === producto.id ? producto : p))
        : [...prev, producto]
    );
    setShowModal(false);
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      setProductos(prev => prev.filter(p => p.id !== id));
    }
  };

  const productosFiltrados = productos.filter(p => {
    const coincideNombre = filtros.nombre
      ? p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
      : true;
    const coincideCategoria = filtros.categoria
      ? p.categoria.toLowerCase().includes(filtros.categoria.toLowerCase())
      : true;
    const coincideTalle = filtros.talle
      ? p.talles?.some(t => t.toLowerCase().includes(filtros.talle.toLowerCase()))
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
            id: Date.now().toString(),
            nombre: '',
            precio: '',
            categoria: '',
            stock: '',
            descripcion: '',
            imagenes: [],
            talles: []
          });
          setShowModal(true);
        }}
      >
        Nuevo Producto
      </Button>

      <FiltroProductos filtros={filtros} setFiltros={setFiltros} />
      <ListaProductos
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

export default admin;

