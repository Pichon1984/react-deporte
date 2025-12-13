import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { CarritoContext } from '../context/CarritoContext';

import MiniaturasCarrusel from '../components/carrusel/MiniaturasCarrusel';
import ImagenPrincipal from '../components/carrusel/ImagenPrincipal';

function DetalleProducto() {
  const { id } = useParams(); // _id de MongoDB
  const [producto, setProducto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [talleSeleccionado, setTalleSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [mostrarToast, setMostrarToast] = useState(false);
  const { agregarProducto } = useContext(CarritoContext);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/productos/${id}`);
        const data = await res.json();
        setProducto(data); // backend devuelve el objeto directo
      } catch (error) {
        console.error('Error cargando producto:', error);
      }
    };
    if (id) fetchProducto();
  }, [id]);

  if (!producto) return <h2 className="text-center py-5">Producto no encontrado</h2>;

  const handleAgregar = () => {
    if (producto.talles?.length && !talleSeleccionado) {
      alert('Seleccioná un talle');
      return;
    }
    if (cantidad < 1 || cantidad > producto.stock) {
      alert(`Solo hay ${producto.stock} unidades disponibles`);
      return;
    }
    agregarProducto(producto, talleSeleccionado || 'único', cantidad);
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
  };

  const imagenes = (producto.imagenes && producto.imagenes.length > 0)
    ? producto.imagenes
    : [producto.img || '/placeholder.jpg'];

  return (
    <Container className="py-5">
      <Row className="align-items-start">
        {/* Imagen principal */}
        <Col xs={12} md={7} className="mb-3">
          <ImagenPrincipal imagen={imagenes[selectedIndex] || '/placeholder.jpg'} />
        </Col>

        {/* Info del producto */}
        <Col xs={12} md={5}>
          <h2>{producto.nombre}</h2>
          <p className="text-muted">Código: {producto._id}</p>
          <p className="text-muted">Categoría: {producto.categoria?.nombre || producto.categoria}</p>
          <p>{producto.descripcion}</p>
          <h4 className="text-success">${producto.precio}</h4>

          <Row className="mb-3">
            {producto.talles?.length > 0 && (
              <Col xs={6}>
                <Form.Group>
                  <Form.Label>Talle</Form.Label>
                  <Form.Select
                    value={talleSeleccionado}
                    onChange={(e) => setTalleSeleccionado(e.target.value)}
                  >
                    <option value="">-- Seleccionar --</option>
                    {producto.talles.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            )}
            <Col xs={6}>
              <Form.Group>
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={producto.stock}
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                />
                <Form.Text className="text-muted">
                  Stock disponible: {producto.stock}
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Button
            variant="primary"
            onClick={handleAgregar}
            disabled={producto.stock === 0}
          >
            Agregar al carrito
          </Button>
        </Col>

        {/* Miniaturas responsive */}
        <Col xs={12} className="mt-4">
          <MiniaturasCarrusel
            imagenes={imagenes}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </Col>
      </Row>

      {mostrarToast && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 9999 }}
        >
          <div className="toast show align-items-center text-white bg-success border-0">
            <div className="d-flex">
              <div className="toast-body">
                ✅ {producto.nombre} x{cantidad} agregado al carrito
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setMostrarToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default DetalleProducto;

