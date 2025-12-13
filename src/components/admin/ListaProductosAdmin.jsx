import { Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ListaProductosAdmin = ({ productos, onEditar, onEliminar }) => {
  const navigate = useNavigate();

  return (
    <Row>
      {productos.map((p, i) => (
        <Col key={p._id || p.id || i} xs={12} sm={6} md={4} lg={3} className="mb-4">
          <Card
            className="h-100 text-center shadow-sm"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/detalle/${p._id || p.id}`)}
          >
            <Card.Img
              variant="top"
              src={p.imagenes?.[0] || "/placeholder.jpg"}
              alt={p.nombre}
              style={{ height: "140px", objectFit: "contain" }}
            />
            <Card.Body>
              <Card.Title>{p.nombre}</Card.Title>
              <p>Precio: ${p.precio}</p>
              <p>Categoría: {p.categoria?.nombre || p.categoria || "N/A"}</p>
              <p>Stock: {p.stock}</p>
              <p>Talles: {(p.talles || []).join(", ") || "N/A"}</p>
              <div className="d-flex justify-content-center gap-2 mt-2">
                <Button
                  variant="warning"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditar(p);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEliminar(p._id || p.id);
                  }}
                >
                  Eliminar
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ListaProductosAdmin;

