import { useState, useEffect } from 'react';
import FiltroProductos from './FiltroProductos';
import ListaProductos from './ListaProductos';
import ProductoForm from './ProductoForm';

const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: '', categoria: '', talle: '' });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('productos')) || [];
    setProductos(guardados);
  }, []);

  const guardarProducto = (nuevo) => {
    const productoFinal = {
      ...nuevo,
      id: crypto.randomUUID(),
      imagen: nuevo.imagenes?.[0] || '/placeholder.jpg',
    };

    const actualizados = modoEdicion
      ? productos.map(p => (p.id === productoEditando.id ? productoFinal : p))
      : [...productos, productoFinal];

    setProductos(actualizados);
    localStorage.setItem('productos', JSON.stringify(actualizados));
    setModoEdicion(false);
    setProductoEditando(null);

    console.log('Producto guardado:', productoFinal);
  };

  const eliminarProducto = (id) => {
    const actualizados = productos.filter(p => p.id !== id);
    setProductos(actualizados);
    localStorage.setItem('productos', JSON.stringify(actualizados));
  };

  const editarProducto = (producto) => {
    setModoEdicion(true);
    setProductoEditando(producto);
  };

  const productosFiltrados = productos.filter(p => {
    const coincideNombre = filtros.nombre === '' || p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
    const coincideCategoria = filtros.categoria === '' || p.categoria === filtros.categoria;
    const coincideTalle = filtros.talle === '' || (p.talles || []).includes(filtros.talle);
    return coincideNombre && coincideCategoria && coincideTalle;
  });

  return (
    <>
      <FiltroProductos filtros={filtros} setFiltros={setFiltros} />
      <ProductoForm
        productoInicial={modoEdicion ? productoEditando : {}}
        onGuardar={guardarProducto}
        onCancelar={() => {
          setModoEdicion(false);
          setProductoEditando(null);
        }}
      />
      <ListaProductos
        productos={productosFiltrados}
        onEditar={editarProducto}
        onEliminar={eliminarProducto}
      />
    </>
  );
};

export default AdminProductos;

