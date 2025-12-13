

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';

const Producto = ({ titulo, productos = [] }) => {
  const navigate = useNavigate();
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtros, setFiltros] = useState({
    precioMin: '',
    precioMax: '',
    soloStock: false,
    orden: 'recientes',
  });

  const productosPorPagina = 6;

  const esNuevo = (fecha) => {
    if (!fecha) return false;
    const dias = (Date.now() - new Date(fecha).getTime()) / (1000 * 60 * 60 * 24);
    return dias <= 7;
  };

  const aplicarFiltros = () => {
    let lista = Array.isArray(productos) ? [...productos] : [];

    if (filtros.precioMin) {
      lista = lista.filter(p => Number(p.precio) >= Number(filtros.precioMin));
    }
    if (filtros.precioMax) {
      lista = lista.filter(p => Number(p.precio) <= Number(filtros.precioMax));
    }
    if (filtros.soloStock) {
      lista = lista.filter(p => p.stock > 0);
    }

    if (filtros.orden === 'precioAsc') {
      lista.sort((a, b) => a.precio - b.precio);
    } else if (filtros.orden === 'precioDesc') {
      lista.sort((a, b) => b.precio - a.precio);
    } else {
      lista.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
    }

    return lista;
  };

  const productosFiltrados = aplicarFiltros();
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const productosPagina = productosFiltrados.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">{titulo}</h2>

      <Form className="mb-4">
        <Row className="g-2">
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Precio mínimo"
              value={filtros.precioMin}
              onChange={(e) => setFiltros(prev => ({ ...prev, precioMin: e.target.value }))}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Precio máximo"
              value={filtros.precioMax}
              onChange={(e) => setFiltros(prev => ({ ...prev, precioMax: e.target.value }))}
            />
          </Col>
          <Col md={2}>
            <Form.Check
              type="checkbox"
              label="Solo con stock"
              checked={filtros.soloStock}
              onChange={(e) => setFiltros(prev => ({ ...prev, soloStock: e.target.checked }))}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={filtros.orden}
              onChange={(e) => setFiltros(prev => ({ ...prev, orden: e.target.value }))}
            >
              <option value="recientes">Más recientes</option>
              <option value="precioAsc">Precio ascendente</option>
              <option value="precioDesc">Precio descendente</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button variant="primary" onClick={() => setPaginaActual(1)}>
              Aplicar filtros
            </Button>
          </Col>
        </Row>
      </Form>

      <Row className="g-4">
        {productosPagina.length === 0 ? (
          <p className="text-center">No hay productos que coincidan con los filtros.</p>
        ) : (
          productosPagina.map((producto) => (
            <Col lg={4} md={6} sm={6} xs={12} key={producto._id}>
              <Card
                className="h-100 text-center shadow-sm border-0"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/detalle/${producto._id}`)}
              >
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={producto.imagen || producto.imagenes?.[0] || '/placeholder.jpg'}
                    alt={producto.nombre || 'Producto'}
                    style={{
                      height: '150px',
                      width:'150px',
                      objectFit: 'cover',
                      borderTopLeftRadius: '0.5rem',
                      borderTopRightRadius: '0.5rem'
                    }}
                  />
                  {producto.stock === 0 && (
                    <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                      Sin stock
                    </Badge>
                  )}
                  {esNuevo(producto.fechaCreacion) && (
                    <Badge bg="success" className="position-absolute top-0 start-0 m-2">
                      Nuevo
                    </Badge>
                  )}
                </div>
                <Card.Body style={{ padding: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#333' }}>
                    ${Number(producto.precio).toLocaleString('es-AR')}
                  </h3>
                  <Card.Text>{producto.nombre}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center mt-4">
          {[...Array(totalPaginas)].map((_, i) => (
            <Button
              key={i}
              variant={paginaActual === i + 1 ? 'primary' : 'outline-primary'}
              className="me-2"
              onClick={() => setPaginaActual(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Producto;

