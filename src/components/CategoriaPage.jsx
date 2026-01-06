import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert, Form, Pagination } from "react-bootstrap";
import { getProductos } from "../services/api"; // 👈 usa siempre _id

function CategoriaPage() {
  const { id } = useParams(); // 👈 siempre recibimos el _id de la categoría
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [ordenPrecio, setOrdenPrecio] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const fetchProductos = async (pagina = 1) => {
    if (!id || id === "undefined") {
      setError("Categoría inválida");
      setLoading(false);
      return;
    }

    setLoading(true);
    const respuesta = await getProductos(id, pagina, limit);

    if (!respuesta.ok) {
      setError(`Error HTTP: ${respuesta.status} - ${respuesta.data.msg || "Error desconocido"}`);
      setLoading(false);
      return;
    }

    const data = respuesta.data;
    setProductos(data.productos || []);
    setPage(data.page || pagina);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    console.log("ID recibido en CategoriaPage:", id); // 👈 debería ser un ObjectId válido
    fetchProductos(1);
  }, [id]);

  // 🔹 Filtrado y orden
  let productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  if (ordenPrecio === "asc") {
    productosFiltrados.sort((a, b) => a.precio - b.precio);
  } else if (ordenPrecio === "desc") {
    productosFiltrados.sort((a, b) => b.precio - a.precio);
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <Pagination className="mt-4 justify-content-center">
        <Pagination.First disabled={page === 1} onClick={() => fetchProductos(1)} />
        <Pagination.Prev disabled={page === 1} onClick={() => fetchProductos(page - 1)} />
        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === page}
            onClick={() => fetchProductos(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next disabled={page === totalPages} onClick={() => fetchProductos(page + 1)} />
        <Pagination.Last disabled={page === totalPages} onClick={() => fetchProductos(totalPages)} />
      </Pagination>
    );
  };

  if (loading)
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Cargando productos...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="py-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );

  return (
    <Container className="py-5">
      <h2 className="mb-4">Productos de la categoría</h2>

      {/* Filtros */}
      <Form className="mb-4 d-flex flex-wrap gap-3">
        <Form.Control
          type="text"
          placeholder="Filtrar por nombre..."
          value={filtroNombre}
          onChange={(e) => {
            setFiltroNombre(e.target.value);
            setPage(1);
          }}
          style={{ maxWidth: "200px" }}
        />
        <Form.Select
          value={ordenPrecio}
          onChange={(e) => {
            setOrdenPrecio(e.target.value);
            setPage(1);
          }}
          style={{ maxWidth: "200px" }}
        >
          <option value="">Ordenar por precio</option>
          <option value="asc">Menor a mayor</option>
          <option value="desc">Mayor a menor</option>
        </Form.Select>
      </Form>

      {productosFiltrados.length === 0 ? (
        <Alert variant="warning">No hay productos disponibles con esos filtros</Alert>
      ) : (
        <>
          <Row>
            {productosFiltrados.map((producto) => (
              <Col key={producto._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card
                  className="h-100 text-center shadow-sm"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/detalle/${producto._id}`)}
                >
                  <div
                    style={{
                      height: "150px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={
                        producto.imagenes?.[0] ||
                        producto.img ||
                        producto.imagen ||
                        "/placeholder.jpg"
                      }
                      alt={producto.nombre}
                      style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                    />
                  </div>
                  <Card.Body style={{ padding: "0.5rem" }}>
                    <Card.Title style={{ fontSize: "1rem" }}>{producto.nombre}</Card.Title>
                    <Card.Text style={{ fontSize: "0.9rem" }}>${producto.precio}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Paginación */}
          {renderPagination()}
        </>
      )}
    </Container>
  );
}

export default CategoriaPage;
