import React from 'react';
import { Carousel, Button, Form, Container } from 'react-bootstrap';

const ProductoDetalle = ({ titulo, precio, descripcion, imagenes, talles, enlaceCarrito }) => {
  return (
    <Container className="my-5">
      <Carousel className="mb-4">
        {imagenes.map((img, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={img}
              alt={`Slide ${index + 1}`}
              style={{ maxHeight: '400px', objectFit: 'contain' }}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      <h2 className="mb-3">{titulo}</h2>
      <h4 className="text-primary">Precio: {precio}</h4>

      <Form.Group className="my-3" controlId="talle">
        <Form.Label>Selecciona tu talle:</Form.Label>
        <Form.Select>
          {talles.map((talle, index) => (
            <option key={index} value={talle}>{talle}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button href={enlaceCarrito} variant="primary" className="mb-4">
        Agregar al carrito
      </Button>

      <p>{descripcion}</p>
    </Container>
  );
};

export default ProductoDetalle;



