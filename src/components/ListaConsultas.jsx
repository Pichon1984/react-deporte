import React, { useEffect, useState } from "react";
import { ListGroup, Spinner, Pagination } from "react-bootstrap";

function ListaConsultas({ productoId }) {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchConsultas = async (pageNumber = 1) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/consultas/producto/${productoId}?page=${pageNumber}&limit=5`
      );
      const data = await res.json();
      if (data.ok) {
        setConsultas(data.consultas || []);
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
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
    if (productoId) fetchConsultas(page);
  }, [productoId, page]);

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <ListGroup className="mt-2">
        {consultas.length > 0 ? (
          consultas.map((c) => (
            <ListGroup.Item key={c._id}>
              <strong>{c.usuarioId?.nombre || c.usuarioId?.email || "Usuario"}</strong> preguntó:
              <div className="mt-1">{c.mensaje}</div>
              {c.respondida && (
                <div className="mt-2 text-success">
                  <strong>Respuesta:</strong> {c.respuesta}
                </div>
              )}
              <small className="text-muted d-block mt-1">
                {new Date(c.fecha).toLocaleString()}
              </small>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item className="text-muted text-center">
            No hay consultas para este producto
          </ListGroup.Item>
        )}
      </ListGroup>

      {/* 📄 Paginación */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
}

export default ListaConsultas;
