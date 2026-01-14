import React, { useEffect, useState } from "react";
import { Table, Button, Form, Spinner, Pagination } from "react-bootstrap";
import { getConsultas, responderConsulta, deleteConsulta } from "../../services/api";

function AdminConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respuesta, setRespuesta] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchConsultas = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await getConsultas(pageNumber, 10);
      if (res.ok) {
        setConsultas(res.data.consultas || []);
        setTotalPages(res.data.totalPages || 1);
        setPage(res.data.currentPage || pageNumber);
      } else {
        setConsultas([]);
      }
    } catch (error) {
      console.error("Error cargando consultas:", error);
      setConsultas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultas(page);
  }, [page]);

  const handleResponder = async (consultaId) => {
    try {
      const res = await responderConsulta(consultaId, respuesta[consultaId]);
      if (res.ok) {
        setConsultas((prev) =>
          prev.map((c) => (c._id === consultaId ? res.data.consulta : c))
        );
      } else {
        console.error("Error en respuesta:", res.data);
      }
    } catch (error) {
      console.error("Error respondiendo consulta:", error);
    }
  };

  const handleEliminar = async (consultaId) => {
    if (!window.confirm("¿Eliminar esta consulta?")) return;
    try {
      const res = await deleteConsulta(consultaId);
      if (res.ok) {
        setConsultas((prev) => prev.filter((c) => c._id !== consultaId));
      } else {
        console.error("Error eliminando consulta:", res.data);
      }
    } catch (error) {
      console.error("Error eliminando consulta:", error);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="mt-4">
      <h3>Consultas de usuarios</h3>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Usuario</th>
              <th>Consulta</th>
              <th>Fecha</th>
              <th>Respuesta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {consultas.length > 0 ? (
              consultas.map((c) => (
                <tr key={c._id}>
                  <td>{c.productoId?.nombre || c.productoId}</td>
                  <td>{c.usuarioId?.email}</td>
                  <td>{c.mensaje}</td>
                  <td>{new Date(c.fecha).toLocaleString()}</td>
                  <td>
                    {c.respondida ? (
                      <span>{c.respuesta}</span>
                    ) : (
                      <>
                        <Form.Control
                          type="text"
                          className="w-100"
                          placeholder="Escribe respuesta..."
                          value={respuesta[c._id] || ""}
                          onChange={(e) =>
                            setRespuesta({ ...respuesta, [c._id]: e.target.value })
                          }
                        />
                        <Button
                          size="sm"
                          className="w-100 mt-2"
                          onClick={() => handleResponder(c._id)}
                        >
                          Responder
                        </Button>
                      </>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-100"
                      onClick={() => handleEliminar(c._id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No hay consultas registradas
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Pagination className="justify-content-center mt-3">
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === page}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
}

export default AdminConsultas;

