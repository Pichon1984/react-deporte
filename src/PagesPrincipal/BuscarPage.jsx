import React, { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Card, Button, Row, Col } from "react-bootstrap";

const BuscarPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query") || "";
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`/api/productos?search=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          // ✅ si la API devuelve { productos: [...] }
          setProductos(Array.isArray(data.productos) ? data.productos : []);
        })
        .catch((err) => {
          console.error("Error en fetch:", err);
          setProductos([]);
        });
    }
  }, [query]);

  return (
    <div className="container mt-4">
      <h2>Resultados de búsqueda: "{query}"</h2>
      {productos.length === 0 ? (
        <p>No se encontraron productos</p>
      ) : (
        <Row>
          {productos.map((p) => (
            <Col key={p._id} xs={12} md={4} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm">
                {p.imagenes && p.imagenes.length > 0 && (
                  <Card.Img
                    variant="top"
                    src={p.imagenes[0]}
                    alt={p.nombre}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{p.nombre}</Card.Title>
                  <Card.Text>
                    <strong>${p.precio}</strong>
                  </Card.Text>
                  <Button
                    as={NavLink}
                    to={`/detalle/${p._id}`}
                    variant="primary"
                    size="sm"
                  >
                    Ver detalle
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default BuscarPage;
