import React, { useEffect, useState } from "react";
import { ListGroup, Spinner } from "react-bootstrap";

function ListaConsultas({ productoId }) {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/consultas/producto/${productoId}`);
        const data = await res.json();
        setConsultas(data);
      } catch (error) {
        console.error("Error cargando consultas:", error);
      } finally {
        setLoading(false);
      }
    };
    if (productoId) fetchConsultas();
  }, [productoId]);

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="mt-3">
      <h6>Consultas de otros clientes</h6>
      {consultas.length > 0 ? (
        <ListGroup>
          {consultas.map((c) => (
            <ListGroup.Item key={c._id}>
              <strong>{c.usuarioId?.nombre || "Usuario"}:</strong> {c.mensaje}
              <br />
              <small className="text-muted">
                {new Date(c.fecha).toLocaleDateString()} {new Date(c.fecha).toLocaleTimeString()}
              </small>
              {c.respondida ? (
                <div className="mt-2 p-2 bg-light border rounded">
                  <strong>Respuesta del vendedor:</strong> {c.respuesta}
                </div>
              ) : (
                <span className="text-muted">Sin respuesta aún</span>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted">Todavía no hay consultas para este producto. Sé el primero en preguntar.</p>
      )}
    </div>
  );
}

export default ListaConsultas;



