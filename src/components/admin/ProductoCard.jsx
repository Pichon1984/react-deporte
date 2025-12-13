import { Card, Button, Col } from "react-bootstrap";

const ProductoCard = ({ producto, onEditar, onEliminar }) => {
  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
      <Card className="h-100 text-center shadow-sm" style={{ fontSize: "0.9rem" }}>
        <div
          style={{
            height: "140px", // 👈 más chico que antes
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Card.Img
            variant="top"
            src={producto.imagen || "/placeholder.jpg"}
            alt={producto.nombre}
            style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
          />
        </div>
        <Card.Body style={{ padding: "0.5rem" }}>
          <Card.Title style={{ fontSize: "1rem" }}>{producto.nombre}</Card.Title>
          <p style={{ margin: 0 }}>Categoría: {producto.categoria}</p>
          <p style={{ margin: 0 }}>Precio: ${producto.precio}</p>
          <p style={{ margin: 0 }}>Stock: {producto.stock}</p>
          <p style={{ margin: 0 }}>
            Talles: {(producto.talles || []).join(", ") || "N/A"}
          </p>
          <div className="d-flex justify-content-center gap-2 mt-2">
            <Button variant="warning" size="sm" onClick={onEditar}>
              Editar
            </Button>
            <Button variant="danger" size="sm" onClick={onEliminar}>
              Eliminar
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductoCard;



