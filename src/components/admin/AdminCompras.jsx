import { useEffect, useState, useMemo } from "react";
import { Table, Form, Row, Col, Button, Alert, Spinner, Pagination } from "react-bootstrap";

import { API_URL } from "../../services/api";
import { fetchConToken } from "../../helpers/fetchConToken"; // 🔹 Importa tu helper

const AdminCompras = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [filtros, setFiltros] = useState({ estado: "", desde: "", hasta: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const queryParamsBase = useMemo(() => {
    const qp = new URLSearchParams();
    if (filtros.estado) qp.append("estado", filtros.estado);
    if (filtros.desde) qp.append("desde", filtros.desde);
    if (filtros.hasta) qp.append("hasta", filtros.hasta);
    qp.append("limit", limit);
    return qp;
  }, [filtros, limit]);

  const fetchCompras = async (pagina = 1) => {
    try {
      setLoading(true);
      const res = await fetchConToken(
        `${API_URL}/api/compras?page=${pagina}&limit=${limit}&estado=${filtros.estado}&desde=${filtros.desde}&hasta=${filtros.hasta}`
      );
      if (res.ok) {
        setCompras(Array.isArray(res.data.compras) ? res.data.compras : []);
        setPage(res.data.page || pagina);
        setTotalPages(res.data.totalPages || 1);
        setMensaje({ tipo: "success", texto: "Compras cargadas correctamente" });
      } else {
        setMensaje({ tipo: "danger", texto: "Error al cargar compras" });
        setCompras([]);
        setPage(1);
        setTotalPages(1);
      }
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error al cargar compras" });
      setCompras([]);
      setPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompras(1);
  }, []);

  const aplicarFiltros = () => {
    setPage(1);
    fetchCompras(1);
  };

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);
    fetchCompras(p);
  };

  const confirmarPagoHandler = async (id) => {
    try {
      const res = await fetchConToken(`${API_URL}/api/compras/${id}/confirmar-pago`, {
        method: "PUT",
      });
      if (res.ok) {
        setCompras((prev) =>
          prev.map((c) => (c._id === id ? res.data.compra : c))
        );
        setMensaje({ tipo: "success", texto: "Pago confirmado y stock actualizado" });
      } else {
        setMensaje({ tipo: "danger", texto: "Error al confirmar pago" });
      }
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error al confirmar pago" });
    }
  };

  const guardarEnvio = async (compra) => {
    try {
      const res = await fetchConToken(`${API_URL}/api/compras/${compra._id}/envio`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estadoEnvio: compra.estadoEnvio,
          trackingNumber: compra.trackingNumber || "",
          courier: compra.courier || "",
        }),
      });
      if (res.ok) {
        setCompras((prev) =>
          prev.map((c) => (c._id === compra._id ? res.data.compra : c))
        );
        setMensaje({ tipo: "success", texto: "Estado de envío actualizado" });
      } else {
        setMensaje({ tipo: "danger", texto: "Error al actualizar estado de envío" });
      }
    } catch (error) {
      setMensaje({ tipo: "danger", texto: "Error al actualizar estado de envío" });
    }
  };

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

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-4">
        <Spinner animation="border" />
      </div>
    );
  }


  return (
    <div className="mt-3">
      <h3>Compras de clientes</h3>

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
            <option value="pagada">Pagada</option>
            <option value="cancelada">Cancelada</option>
            <option value="fallida">Fallida</option>
            <option value="reembolsada">Reembolsada</option>
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

      {/* Tabla de compras */}
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Email</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Envío</th>
              <th>Tracking</th>
              <th>Courier</th>
              <th>Fechas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((compra) => (
              <tr key={compra._id}>
                <td>{compra.usuario?.nombre || "-"}</td>
                <td>{compra.usuario?.correo || "-"}</td>
                <td>
                  <ul className="mb-0">
                    {(compra.productos || []).map((p, i) => (
                      <li key={i}>
                        {p.nombre} × {p.cantidad}
                        {p.talle ? ` (${p.talle})` : ""}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>${compra.totalFinal}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`badge ${
                        compra.estado === "pagada"
                          ? "bg-success"
                          : compra.estado === "cancelada" || compra.estado === "fallida"
                          ? "bg-danger"
                          : compra.estado === "reembolsada"
                          ? "bg-secondary"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {compra.estado}
                    </span>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => confirmarPagoHandler(compra._id)}
                      disabled={compra.estado !== "pendiente"}
                    >
                      Confirmar pago
                    </Button>
                  </div>
                </td>

                <td style={{ minWidth: 160 }}>
                  <Form.Select
                    value={compra.estadoEnvio || "pendiente"}
                    onChange={(e) =>
                      setCompras((prev) =>
                        prev.map((c) =>
                          c._id === compra._id ? { ...c, estadoEnvio: e.target.value } : c
                        )
                      )
                    }
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                  </Form.Select>
                </td>

                <td style={{ minWidth: 180 }}>
                  <Form.Control
                    placeholder="Número de seguimiento"
                    value={compra.trackingNumber || ""}
                    onChange={(e) =>
                      setCompras((prev) =>
                        prev.map((c) =>
                          c._id === compra._id ? { ...c, trackingNumber: e.target.value } : c
                        )
                      )
                    }
                  />
                </td>

                <td style={{ minWidth: 160 }}>
                  <Form.Control
                    placeholder="Courier"
                    value={compra.courier || ""}
                    onChange={(e) =>
                      setCompras((prev) =>
                        prev.map((c) =>
                          c._id === compra._id ? { ...c, courier: e.target.value } : c
                        )
                      )
                    }
                  />
                </td>

                <td>
                  <div className="small">
                    <div>Creada: {new Date(compra.createdAt).toLocaleDateString()}</div>
                    {compra.fechaEnvio && (
                      <div>Envío: {new Date(compra.fechaEnvio).toLocaleDateString()}</div>
                    )}
                    {compra.fechaEntrega && (
                      <div>Entrega: {new Date(compra.fechaEntrega).toLocaleDateString()}</div>
                    )}
                  </div>
                </td>

                <td>
                  <div className="d-flex flex-column gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => guardarEnvio(compra)}
                    >
                      Guardar envío
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {compras.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center">
                  No hay compras para los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {renderPagination()}
    </div>
  );
};

export default AdminCompras;
