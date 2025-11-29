import React, { useContext } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { CarritoContext } from '../context/CarritoContext';
import { BsTrash } from 'react-icons/bs';

const carritoPage = () => {
  const { carrito, agregarProducto, eliminarProducto, vaciarCarrito,eliminarProductoTotal, } = useContext(CarritoContext);

  const calcularTotal = () => {
    return carrito.reduce((total, item) => {
      const precioNumerico = parseFloat(item.precio?.toString().replace(/[^0-9.-]+/g, '')) || 0;
      return total + precioNumerico * item.cantidad;
    }, 0);
  };

  const extraerProductoBase = (item) => ({
    id: item.id.replace(`-${item.talle}`, ''),
    nombre: item.nombre,
    precio: item.precio,
    imagenes: [item.imagen],
    descripcion: item.descripcion,
    categoria: item.categoria,
    stock: item.stock,
    talles: item.talles,
  });
/// Dentro del componente carritoPage...

// ...
if (carrito.length === 0) {
    return (
        <Container 
            className="py-5 text-center d-flex flex-column justify-content-center align-items-center" 
            style={{ minHeight: '60vh' }}
        >
            {/* 1. Ícono Grande y Atractivo */}
            {/* Usamos un ícono SVG grande para impacto visual, en color azul Workify */}
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="#007bff" className="bi bi-bag-x mb-4" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6.146 8.146a.5.5 0 0 1 .708 0L8 9.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 10l1.147 1.146a.5.5 0 0 1-.708.708L8 10.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 10 6.146 8.854a.5.5 0 0 1 0-.708"/>
                <path d="M8 1a2.5 2.5 0 0 0-2.5 2.5V4h5v-.5A2.5 2.5 0 0 0 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
            </svg>

            {/* 2. Mensaje Principal */}
            <h2 className="display-5 fw-light text-dark mb-2">¡Oh no! Tu carrito está vacío.</h2>
            
            {/* 3. Mensaje Secundario */}
            <p className="lead text-muted mb-4">
                Parece que aún no has encontrado el equipo perfecto. ¡Echa un vistazo a nuestros productos destacados!
            </p>

            {/* 4. Botón a Home (¡Como lo pediste!) */}
            <Button 
                variant="primary" 
                size="lg" 
                href="/inicio" // El enlace que te lleva al Home
                className="mt-3 shadow-sm"
            >
                Volver a la Página Principal
            </Button>
            
        </Container>
    );
}
// ... continúa con el resto del componente (el renderizado del carrito lleno)

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
              onClick={() => agregarProducto(extraerProductoBase(item), item.talle, 1)}
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
              onClick={() => eliminarProductoTotal(item.id)}
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

export default carritoPage;

