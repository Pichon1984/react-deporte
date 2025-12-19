import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Form } from 'react-bootstrap';

function CategoriaPage() {
  const { nombre } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtroNombre, setFiltroNombre] = useState('');
  const [ordenPrecio, setOrdenPrecio] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/productos?categoria=${nombre.toLowerCase()}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        setProductos(Array.isArray(data) ? data : data.productos);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProductos();
  }, [nombre]);

  let productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  if (ordenPrecio === 'asc') {
    productosFiltrados.sort((a, b) => a.precio - b.precio);
  } else if (ordenPrecio === 'desc') {
    productosFiltrados.sort((a, b) => b.precio - a.precio);
  }

  if (loading) return (
    <Container className="py-5 text-center">
      <Spinner animation="border" variant="primary" />
      <p>Cargando productos de {nombre}...</p>
    </Container>
  );

  if (error) return (
    <Container className="py-5">
      <Alert variant="danger">Error: {error}</Alert>
    </Container>
  );

  return (
    <Container className="py-5">
      <h2 className="mb-4">Categoría: {nombre}</h2>

      <Form className="mb-4 d-flex flex-wrap gap-3">
        <Form.Control
          type="text"
          placeholder="Filtrar por nombre..."
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          style={{ maxWidth: '200px' }}
        />
        <Form.Select
          value={ordenPrecio}
          onChange={(e) => setOrdenPrecio(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">Ordenar por precio</option>
          <option value="asc">Menor a mayor</option>
          <option value="desc">Mayor a menor</option>
        </Form.Select>
      </Form>

      {productosFiltrados.length === 0 ? (
        <Alert variant="warning">No hay productos disponibles en {nombre} con esos filtros</Alert>
      ) : (
        <Row>
          {productosFiltrados.map((producto) => (
            <Col key={producto._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card
                className="h-100 text-center shadow-sm"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/detalle/${producto._id}`)}
              >
                <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Card.Img
                    variant="top"
                    src={
                      producto.imagenes?.[0] ||   // ✅ si es array de URLs (links externos)
                      producto.img ||             // ✅ si se guardó en un campo único
                      producto.imagen ||          // ✅ si se guardó como "imagen"
                      '/placeholder.jpg'          // fallback si no hay nada
                    }
                    alt={producto.nombre}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>
                <Card.Body style={{ padding: '0.5rem' }}>
                  <Card.Title style={{ fontSize: '1rem' }}>{producto.nombre}</Card.Title>
                  <Card.Text style={{ fontSize: '0.9rem' }}>
                    ${producto.precio}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default CategoriaPage;


