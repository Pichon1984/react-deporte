import React, { useContext } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { CarritoContext } from "../context/CarritoContext";
import { BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const CarritoPage = () => {
  const {
    carrito,
    sumarUnidad,
    eliminarProducto,
    vaciarCarrito,
    eliminarProductoTotal
  } = useContext(CarritoContext);
  const navigate = useNavigate();

  const calcularTotal = () =>
    carrito.reduce(
      (total, item) =>
        total + Number(item.productoId?.precio || 0) * item.cantidad,
      0
    );

  // 👉 función para confirmar compra desde carrito
  async function confirmarCarrito() {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        "x-token": token // 👈 coincide con tu middleware
      };

      // transformar carrito a la estructura que espera el modelo Compra
      const productos = carrito.map(item => ({
        productoId: item.productoId._id,
        nombre: item.productoId.nombre,
        precio: item.productoId.precio,
        cantidad: item.cantidad,
        talle: item.talle
      }));

      const total = calcularTotal();

      const res = await fetch("/api/compras", {
        method: "POST",
        headers,
        body: JSON.stringify({ productos, total })
      });

      const data = await res.json();
      if (res.ok) {
        // redirigir al checkout de la compra recién creada
        navigate(`/checkout/${data._id}`);
      } else {
        console.error("Error creando compra desde carrito:", data.error);
      }
    } catch (err) {
      console.error("Error en confirmarCarrito:", err);
    }
  }

  if (carrito.length === 0) {
    return (
      <Container
        className="py-5 text-center d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="120"
          fill="#007bff"
          className="bi bi-bag-x mb-4"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M6.146 8.146a.5.5 0 0 1 .708 0L8 9.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 10l1.147 1.146a.5.5 0 0 1-.708.708L8 10.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 10 6.146 8.854a.5.5 0 0 1 0-.708"
          />
          <path d="M8 1a2.5 2.5 0 0 0-2.5 2.5V4h5v-.5A2.5 2.5 0 0 0 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
        </svg>
        <h2 className="display-5 fw-light text-dark mb-2">
          ¡Oh no! Tu carrito está vacío.
        </h2>
        <p className="lead text-muted mb-4">
          Parece que aún no has encontrado el equipo perfecto. ¡Echa un vistazo
          a nuestros productos destacados!
        </p>
        <Button
          variant="primary"
          size="lg"
          href="/inicio"
          className="mt-3 shadow-sm"
        >
          Volver a la Página Principal
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Carrito de compras</h2>

      {carrito.map((item, index) => (
        <Row key={index} className="align-items-center mb-4 border-bottom pb-3">
          {/* Imagen */}
          <Col xs={4} md={2}>
            <Image
              src={item.productoId?.imagen || "/assets/img/default.png"}
              alt={item.productoId?.nombre}
              fluid
              rounded
              onError={(e) => {
                e.target.src = "/assets/img/default.png";
              }}
            />
          </Col>

          {/* Info producto */}
          <Col xs={8} md={6}>
            <h5>{item.productoId?.nombre}</h5>
            <p className="mb-1">Talle: {item.talle}</p>
            <p className="text-success fw-bold">
              ${Number(item.productoId?.precio || 0)} x {item.cantidad} = $
              {(Number(item.productoId?.precio || 0) * item.cantidad).toLocaleString("es-AR")}
            </p>
          </Col>

          {/* Acciones */}
          <Col
            xs={12}
            md={4}
            className="text-md-end d-flex justify-content-end align-items-center gap-2 mt-3 mt-md-0"
          >
            <Button
              variant="outline-secondary"
              onClick={() => sumarUnidad(item.productoId._id, item.talle)}
              title="Sumar unidad"
            >
              +
            </Button>
            <span>{item.cantidad}</span>
            <Button
              variant="outline-secondary"
              onClick={() => eliminarProducto(item.productoId._id, item.talle)}
              title="Eliminar una unidad"
            >
              -
            </Button>
            <Button
              variant="outline-danger"
              onClick={() =>
                eliminarProductoTotal(item.productoId._id, item.talle)
              }
              title="Eliminar producto"
            >
              <BsTrash size={20} />
            </Button>
          </Col>
        </Row>
      ))}

      {/* Total y acciones */}
      <Row className="mt-4">
        <Col className="text-end">
          <h4>Total: ${calcularTotal().toLocaleString("es-AR")}</h4>
          <Button
            variant="success"
            className="mt-2"
            onClick={confirmarCarrito}
          >
            Terminar compra
          </Button>
          <Button
            variant="outline-danger"
            className="mt-2 ms-2"
            onClick={vaciarCarrito}
          >
            Vaciar carrito
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CarritoPage;

