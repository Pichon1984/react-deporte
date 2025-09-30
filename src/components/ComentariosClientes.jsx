import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../styles/comentarios.css'

const comentarios = [
  {
    nombre: 'Lucía Fernández',
    texto: 'Excelente atención y productos de calidad. Compré unas zapatillas y llegaron rapidísimo.',
  },
  {
    nombre: 'Martín Gómez',
    texto: 'Muy buena experiencia. El sitio es fácil de usar y encontré justo lo que buscaba.',
  },
  {
    nombre: 'Carla Ruiz',
    texto: 'Me encantó la variedad de indumentaria. Todo llegó en perfecto estado y bien embalado.',
  },
];

const ComentariosClientes = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Comentarios de nuestros clientes</h2>
      <Row className="g-4 justify-content-center">
        {comentarios.map((comentario, index) => (
          <Col md={4} key={index}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{comentario.nombre}</Card.Title>
                <Card.Text>"{comentario.texto}"</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ComentariosClientes;

