import { useState } from "react";
import { Row, Col, Card, Button, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ListaProductosAdmin = ({ productos, onEditar, onEliminar }) => {
  const navigate = useNavigate();

  // 🔹 Estado para paginación
  const [page, setPage] = useState(1);
  const limit = 6; // cantidad de productos por página
  const totalPages = Math.ceil(productos.length / limit);

  const startIndex = (page - 1) * limit;
  const currentProductos = productos.slice(startIndex, startIndex + limit);

  const getImagenProducto = (p) =>
    p.imagenes?.[0] || p.img || p.imagen || "/placeholder.jpg";

  // 🔹 Render de paginación
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <Pagination className="mt-3 justify-content-center">
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
    );
  };

  return (
    <>
      <Row>
        {currentProductos.map((p, i) => (
          <Col key={p._id || p.id || i} xs={12} className="mb-3">
            <Card
              className="shadow-sm"
              style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",   // 🔹 alinea imagen y texto
                height: "180px",        // 🔹 un poco más alta para que entre todo
              }}
              onClick={() => navigate(`/detalle/${p._id || p.id}`)}
            >
              {/* Imagen */}
              <div
                style={{
                  flex: "0 0 200px",     // ancho fijo para la imagen
                  height: "100%",        // ocupa toda la altura de la card
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  padding: "10px",
                }}
              >
                <Card.Img
                  src={getImagenProducto(p)}
                  alt={p.nombre || "Producto"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain", // 🔹 evita distorsión
                  }}
                />
              </div>

              {/* Info */}
              <Card.Body
                style={{
                  flex: "1 1 auto",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center", // 🔹 centra verticalmente el texto
                }}
              >
                <Card.Title className="mb-1">{p.nombre}</Card.Title>
                <p className="mb-1">Precio: ${p.precio}</p>
                <p className="mb-1">
                  Categoría: {p.categoria?.nombre || p.categoria || "N/A"}
                </p>
                <p className="mb-1">Stock: {p.stock}</p>
                <p className="mb-1">
                  Talles: {(p.talles || []).join(", ") || "N/A"}
                </p>
                <div className="d-flex gap-2 mt-2">
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

      {/* Paginación */}
      {renderPagination()}
    </>
  );
};

export default ListaProductosAdmin;
