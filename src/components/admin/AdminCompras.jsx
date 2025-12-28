import { useEffect, useState, useMemo } from "react";
import { Table, Form, Row, Col, Button, Alert, Spinner, Pagination } from "react-bootstrap";
import { API_URL } from "../../services/api";

const AdminCompras = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [filtros, setFiltros] = useState({ estado: "", desde: "", hasta: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");
  const limit = 10; // cantidad de órdenes por página

  const queryParamsBase = useMemo(() => {
    const qp = new URLSearchParams();
    if (filtros.estado) qp.append("estado", filtros.estado);
    if (filtros.desde) qp.append("desde", filtros.desde);
    if (filtros.hasta) qp.append("hasta", filtros.hasta);
    qp.append("limit", limit);
    return qp;
  }, [filtros, limit]);

  const fetchOrdenes = async (pagina = 1) => {
    try {
      setLoading(true);
      const qp = new URLSearchParams(queryParamsBase.toString());
      qp.set("page", pagina);

      const res = await fetch(`${API_URL}/api/ordenes/filtrar?${qp.toString()}`, {
        headers: { "x-token": token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);

      setOrdenes(Array.isArray(data.ordenes) ? data.ordenes : []);
      setPage(data.page || pagina);
      setTotalPages(data.totalPages || 1);
      setMensaje({ tipo: "success", texto: "Órdenes cargadas correctamente" });
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error al cargar órdenes" });
      setOrdenes([]);
      setPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refiltrar con cambios de filtros
  const aplicarFiltros = () => {
    setPage(1);
    fetchOrdenes(1);
  };

  // Paginación UI
  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);
    fetchOrdenes(p);
  };

  // Actualizar estado de envío
  const actualizarEnvio = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`${API_URL}/api/ordenes/${id}/envio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-token": token,
        },
        body: JSON.stringify({ estadoEnvio: nuevoEstado }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error actualizando envío");
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

  // Actualizar estado de pago
  const actualizarPago = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`${API_URL}/api/ordenes/${id}/pago`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-token": token,
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error actualizando pago");
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

  // Cancelar orden
  const cancelarOrden = async (id) => {
    if (!window.confirm("¿Cancelar esta orden?")) return;
    try {
      const res = await fetch(`${API_URL}/api/ordenes/${id}`, {
        method: "DELETE",
        headers: { "x-token": token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error cancelando orden");
      if (data.ok) {
        setOrdenes((prev) =>
          prev.map((o) => (o._id === id ? { ...o, estado: "cancelado" } : o))
        );
        setMensaje({ tipo: "success", texto: "Orden cancelada correctamente" });
      }
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error al cancelar orden" });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-4">
        <Spinner animation="border" />
      </div>
    );
  }

  // Render de botones de paginación (compacto cuando hay muchas páginas)
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const items = [];
    const maxButtons = 5;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);

    items.push(
      <Pagination.First key="first" onClick={() => goToPage(1)} disabled={page === 1} />,
      <Pagination.Prev key="prev" onClick={() => goToPage(page - 1)} disabled={page === 1} />
    );

    if (start > 1) items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);

    for (let p = start; p <= end; p++) {
      items.push(
        <Pagination.Item key={p} active={p === page} onClick={() => goToPage(p)}>
          {p}
        </Pagination.Item>
      );
    }

    if (end < totalPages) items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);

    items.push(
      <Pagination.Next key="next" onClick={() => goToPage(page + 1)} disabled={page === totalPages} />,
      <Pagination.Last key="last" onClick={() => goToPage(totalPages)} disabled={page === totalPages} />
    );

    return <Pagination className="mt-2">{items}</Pagination>;
  };

  return (
    <div className="mt-3">
      <h3>Compras de Clientes</h3>

      {mensaje && (
        <Alert variant={mensaje.tipo} onClose={() => setMensaje(null)} dismissible>
          {mensaje.texto}
        </Alert>
      )}

      {/* Filtros */}
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
          <Button variant="primary" className="w-100" onClick={aplicarFiltros}>
            Filtrar
          </Button>
        </Col>
      </Row>

      {/* Tabla */}
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
              <th>Acciones</th>
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
                    {(orden.productos || []).map((p, i) => (
                      <li key={i}>
                        {p.nombre} × {p.cantidad}
                        {p.talle ? ` (${p.talle})` : ""}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>${orden.total}</td>
                <td style={{ minWidth: 140 }}>
                  <Form.Select
                    value={orden.estado}
                    onChange={(e) => actualizarPago(orden._id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="cancelado">Cancelado</option>
                  </Form.Select>
                </td>
                <td style={{ minWidth: 160 }}>
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
                <td>{new Date(orden.createdAt || orden.fecha).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => cancelarOrden(orden._id)}
                    disabled={orden.estado === "cancelado"}
                  >
                    Cancelar
                  </Button>
                </td>
              </tr>
            ))}
            {ordenes.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center">
                  No hay órdenes para los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Paginación */}
      {renderPagination()}
    </div>
  );
};

export default AdminCompras;
