import React, { useContext, useState } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const CheckoutPage = () => {
  const { carrito, vaciarCarrito } = useContext(CarritoContext);
  const { usuario, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Precargamos datos del usuario registrado
  const [cliente, setCliente] = useState({
    nombre: usuario?.nombre || "",
    email: usuario?.correo || "",
    direccion: usuario?.direccion || "",
    localidad: usuario?.localidad || "",
    provincia: usuario?.provincia || "",
    codigoPostal: usuario?.codigoPostal || "",
    telefono: usuario?.telefono || ""
  });

  const calcularTotal = () =>
    carrito.reduce(
      (total, item) =>
        total + Number(item.productoId?.precio || 0) * item.cantidad,
      0
    );

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/ordenes/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-token": token // 👈 tu backend usa x-token
        },
        body: JSON.stringify({
          cliente,
          productos: carrito.map(item => ({
            productoId: item.productoId._id,
            nombre: item.productoId.nombre,
            precio: item.productoId.precio,
            cantidad: item.cantidad,
            talle: item.talle
          })),
          total: calcularTotal()
        })
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        // 👈 redirige al checkout de MercadoPago
        window.location.href = data.checkoutUrl;
      } else {
        alert("No se pudo iniciar el pago.");
      }
    } catch (error) {
      console.error("Error al crear la orden:", error);
      alert("Hubo un problema al procesar tu compra.");
    }
  };

  return (
    <Container className="py-5">
      <h2>Finalizar compra</h2>
      <Row>
        <Col md={6}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={cliente.nombre}
                onChange={e => setCliente({ ...cliente, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={cliente.email}
                onChange={e => setCliente({ ...cliente, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                value={cliente.direccion}
                onChange={e => setCliente({ ...cliente, direccion: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Localidad</Form.Label>
              <Form.Control
                type="text"
                value={cliente.localidad}
                onChange={e => setCliente({ ...cliente, localidad: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Provincia</Form.Label>
              <Form.Control
                type="text"
                value={cliente.provincia}
                onChange={e => setCliente({ ...cliente, provincia: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Código Postal</Form.Label>
              <Form.Control
                type="text"
                value={cliente.codigoPostal}
                onChange={e =>
                  setCliente({ ...cliente, codigoPostal: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                value={cliente.telefono}
                onChange={e => setCliente({ ...cliente, telefono: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Col>

        <Col md={6} className="text-end">
          <h4>Total: ${calcularTotal().toLocaleString("es-AR")}</h4>
          <Button variant="success" className="mt-3" onClick={handleCheckout}>
            Finalizar compra
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;








