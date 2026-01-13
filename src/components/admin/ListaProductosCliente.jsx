import { Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ListaProductosCliente = ({ productos }) => {
  const navigate = useNavigate();

  if (!productos || productos.length === 0) {
    return <p>No hay productos para mostrar.</p>;
  }

  return (
    <Row>
      {productos.map((p, i) => {
      
        console.log("Producto en Cliente:", p);

        return (
          <Col
            key={p._id || p.id || i}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            className="mb-4"
          >
            <Card
              className="h-100 text-center shadow-sm position-relative"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/detalle/${p._id || p.id}`)}
            >
          
              <Card.Img
                variant="top"
                src={p.imagenes?.[0] || "/placeholder.jpg"}
                alt={p.nombre || "Producto"}
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

  {p.categoria && (
    <p>
      <small>
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate(`/categoria/${p.categoria._id}`)}
        >
          {p.categoria.nombre}
        </span>
      </small>
    </p>
  )}
</Card.Body>


            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ListaProductosCliente;





