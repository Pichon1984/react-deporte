import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Producto = ({ titulo, productos }) => {
  const navigate = useNavigate();

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">{titulo}</h2>
      <Row className="g-4">
        {productos.map((producto, index) => (
          <Col md={4} sm={6} xs={12} key={index}>
            <Card
              className="h-100 text-center shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/detalle/${producto.id}`)}
            >
              <Card.Img
                variant="top"
                src={producto.imagen}
                alt={producto.nombre}
                style={{ height: '200px', objectFit: 'contain' }}
              />
              <Card.Body>
                <h3 style={{ fontSize: '1.2rem', color: '#333' }}>{producto.precio}</h3>
                <Card.Text>{producto.nombre}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Producto;

