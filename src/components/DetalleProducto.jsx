import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { CarritoContext } from '../context/CarritoContext';

import MiniaturasCarrusel from '../components/carrusel/MiniaturasCarrusel';
import ImagenPrincipal from '../components/carrusel/ImagenPrincipal';

function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [talleSeleccionado, setTalleSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [mostrarToast, setMostrarToast] = useState(false);
  const { agregarProducto } = useContext(CarritoContext);

  useEffect(() => {
    const guardados = localStorage.getItem('productos');
    if (guardados) {
      const lista = JSON.parse(guardados);
      const encontrado = lista.find(p => p.id === id || p.id === parseInt(id));
      setProducto(encontrado);
    }
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

  return (
    <Container className="py-5">
      <Row className="align-items-start">
        <Col xs={12} md={2}>
          <MiniaturasCarrusel
            imagenes={producto.imagenes}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </Col>
        <Col xs={12} md={5}>
          <ImagenPrincipal imagen={producto.imagenes[selectedIndex]} />
        </Col>
        <Col xs={12} md={5}>
          <h2>{producto.nombre}</h2>
          <p className="text-muted">Código: {producto.id}</p>
          <p className="text-muted">Categoría: {producto.categoria}</p>
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

