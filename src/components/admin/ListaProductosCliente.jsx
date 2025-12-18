import { Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ListaProductosCliente = ({ productos }) => {
  const navigate = useNavigate();

  return (
    <Row className="g-4">
      {productos.map((p, i) => (
        <Col key={p._id || i} xs={12} sm={6} md={4} lg={3}>
          <Card
            className="h-100 text-center shadow-sm position-relative"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/detalle/${p._id}`)}
            aria-label={`Ver detalle de ${p.nombre}`}
          >
            <Card.Img
              variant="top"
              src={p.imagenes?.[0] || "/placeholder.jpg"}
              alt={p.nombre}
              style={{ height: "200px", objectFit: "contain" }}
            />
            {p.stock === 0 && (
              <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                Sin stock
              </span>
            )}
            <Card.Body>
              <Card.Title>{p.nombre}</Card.Title>
              <p className="fw-bold">
                ${Number(p.precio).toLocaleString("es-AR")}
              </p>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ListaProductosCliente;

