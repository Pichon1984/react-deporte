import { useEffect, useState } from "react";
import { Table, Form, Row, Col, Button, Alert } from "react-bootstrap";

const AdminCompras = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null); // 👈 para mostrar alertas
  const [filtros, setFiltros] = useState({
    estado: "",
    desde: "",
    hasta: ""
  });

  const token = localStorage.getItem("token");

  // ✅ Cargar órdenes
  const fetchOrdenes = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filtros.estado) queryParams.append("estado", filtros.estado);
      if (filtros.desde) queryParams.append("desde", filtros.desde);
      if (filtros.hasta) queryParams.append("hasta", filtros.hasta);

      const res = await fetch(
        `http://localhost:3000/api/ordenes/filtrar?${queryParams.toString()}`,
        { headers: { "x-token": token } }
      );
      const data = await res.json();
      setOrdenes(data);
      setMensaje({ tipo: "success", texto: "Órdenes cargadas correctamente" });
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error al cargar órdenes" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  // ✅ Actualizar estado de envío
  const actualizarEnvio = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:3000/api/ordenes/${id}/envio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-token": token
        },
        body: JSON.stringify({ estadoEnvio: nuevoEstado })
      });
      const data = await res.json();
      if (data.ok) {
        setOrdenes((prev) =>
          prev.map((o) => (o._id === id ? { ...o, estadoEnvio: nuevoEstado } : o))
        );
        setMensaje({ tipo: "success", texto: "Estado de envío actualizado" });
      }
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error al actualizar estado de envío" });
    }
  };

  // ✅ Actualizar estado de pago
  const actualizarPago = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:3000/api/ordenes/${id}/pago`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-token": token
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      const data = await res.json();
      if (data.ok) {
        setOrdenes((prev) =>
          prev.map((o) => (o._id === id ? { ...o, estado: nuevoEstado } : o))
        );
        setMensaje({ tipo: "success", texto: "Estado de pago actualizado" });
      }
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error al actualizar estado de pago" });
    }
  };

  if (loading) return <p>Cargando compras...</p>;

  return (
    <div className="mt-3">
      <h3>Compras de Clientes</h3>

      {/* 🔹 Alertas */}
      {mensaje && (
        <Alert
          variant={mensaje.tipo}
          onClose={() => setMensaje(null)}
          dismissible
        >
          {mensaje.texto}
        </Alert>
      )}

      {/* 🔹 Filtros responsivos */}
      <Row className="mb-3 g-2">
        <Col xs={12} md={3}>
          <Form.Select
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
          >
            <option value="">Estado de pago</option>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="cancelado">Cancelado</option>
          </Form.Select>
        </Col>
        <Col xs={12} md={3}>
          <Form.Control
            type="date"
            value={filtros.desde}
            onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
          />
        </Col>
        <Col xs={12} md={3}>
          <Form.Control
            type="date"
            value={filtros.hasta}
            onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
          />
        </Col>
        <Col xs={12} md={3}>
          <Button variant="primary" className="w-100" onClick={fetchOrdenes}>
            Filtrar
          </Button>
        </Col>
      </Row>

      {/* 🔹 Tabla responsiva */}
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Envío</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden._id}>
                <td>{orden.envio?.nombre}</td>
                <td>{orden.envio?.email}</td>
                <td>
                  {orden.envio?.direccion}, {orden.envio?.localidad}, {orden.envio?.provincia}
                </td>
                <td>
                  <ul className="mb-0">
                    {orden.productos.map((p, i) => (
                      <li key={i}>
                        {p.nombre} × {p.cantidad} ({p.talle})
                      </li>
                    ))}
                  </ul>
                </td>
                <td>${orden.total}</td>
                <td>
                  <Form.Select
                    value={orden.estado}
                    onChange={(e) => actualizarPago(orden._id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="cancelado">Cancelado</option>
                  </Form.Select>
                </td>
                <td>
                  <Form.Select
                    value={orden.estadoEnvio}
                    onChange={(e) => actualizarEnvio(orden._id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="preparando">Preparando</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                  </Form.Select>
                </td>
                <td>{new Date(orden.fecha).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCompras;


