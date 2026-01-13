import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Spinner, Pagination } from 'react-bootstrap';

function AdminConsultas() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respuesta, setRespuesta] = useState({});
  const [page, setPage] = useState(1);         
  const [totalPages, setTotalPages] = useState(1); 
  const token = localStorage.getItem("token"); 

  const fetchConsultas = async (pageNumber = 1) => {
    try {
      const res = await fetch(`http://localhost:3000/api/consultas/todas?page=${pageNumber}&limit=10`, {
        headers: { "x-token": token }
      });
      const data = await res.json();


      if (Array.isArray(data.consultas)) {
        setConsultas(data.consultas);
        setTotalPages(data.totalPages || 1);
        setPage(data.currentPage || 1);
      } else {
        console.error("Respuesta inesperada:", data);
        setConsultas([]);
      }
    } catch (error) {
      console.error('Error cargando consultas:', error);
      setConsultas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchConsultas(page);
  }, [token, page]);

  const handleResponder = async (consultaId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/consultas/${consultaId}/responder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-token': token
        },
        body: JSON.stringify({ respuesta: respuesta[consultaId] })
      });
      const data = await res.json();
      if (data.ok) {
        setConsultas((prev) =>
          prev.map((c) => (c._id === consultaId ? data.consulta : c))
        );
      } else {
        console.error("Error en respuesta:", data);
      }
    } catch (error) {
      console.error('Error respondiendo consulta:', error);
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
                          value={respuesta[c._id] || ''}
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
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
