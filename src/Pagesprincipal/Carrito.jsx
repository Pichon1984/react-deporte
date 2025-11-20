import React, { useContext } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { CarritoContext } from '../context/CarritoContext';
import { BsTrash } from 'react-icons/bs';

const Carrito = () => {
  const { carrito, agregarProducto, eliminarProducto, vaciarCarrito } = useContext(CarritoContext);

  const calcularTotal = () => {
    return carrito.reduce((total, item) => {
      const precioNumerico = parseFloat(item.precio?.toString().replace(/[^0-9.-]+/g, '')) || 0;
      return total + precioNumerico * item.cantidad;
    }, 0);
  };

  if (carrito.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Tu carrito está vacío</h2>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Carrito de compras</h2>

      {carrito.map((item, index) => (
        <Row key={index} className="align-items-center mb-4 border-bottom pb-3">
          <Col xs={3} md={2}>
            <Image
              src={item.imagen}
              alt={item.nombre}
              fluid
              rounded
              onError={(e) => { e.target.src = '/assets/img/default.png'; }}
            />
          </Col>
          <Col xs={9} md={6}>
            <h5>{item.nombre}</h5>
            <p className="mb-1">Talle: {item.talle}</p>
            <p className="text-success fw-bold">
              ${item.precio} x {item.cantidad} = ${parseFloat(item.precio) * item.cantidad}
            </p>
          </Col>
          <Col xs={12} md={4} className="text-md-end d-flex justify-content-end align-items-center gap-2">
            <Button
              variant="outline-secondary"
              onClick={() => {
                const productoBase = {
                  id: item.id.split('-')[0], 
                  nombre: item.nombre,
                  precio: item.precio,
                  imagenes: [item.imagen],
                  descripcion: item.descripcion,
                  categoria: item.categoria,
                  stock: item.stock,
                  talles: item.talles,
                };
                agregarProducto(productoBase, item.talle, 1);
              }}


              title="Sumar unidad"
            >
              +
            </Button>
            <span>{item.cantidad}</span>
            <Button
              variant="outline-secondary"
              onClick={() => eliminarProducto(item.id)}
              title="Eliminar una unidad"
            >
              -
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => eliminarProducto(item.id)}
              title="Eliminar producto"
            >
              <BsTrash size={20} />
            </Button>
          </Col>
        </Row>
      ))}

      <Row className="mt-4">
        <Col className="text-end">
          <h4>Total: ${calcularTotal().toLocaleString('es-AR')}</h4>
          <Button variant="success" className="mt-2">
            Terminar compra
          </Button>
          <Button variant="outline-danger" className="mt-2 ms-2" onClick={vaciarCarrito}>
            Vaciar carrito
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Carrito;



