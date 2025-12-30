import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Form, Button, Pagination, ListGroup, Tabs, Tab } from "react-bootstrap";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tab, setTab] = useState("activos"); // solapa actual

  const fetchUsuarios = async (searchTerm = "", pageNumber = 1) => {
    try {
      const token = localStorage.getItem("token");
      const url = searchTerm
        ? `http://localhost:3000/api/usuarios?search=${encodeURIComponent(searchTerm)}&page=${pageNumber}&limit=10`
        : `http://localhost:3000/api/usuarios?page=${pageNumber}&limit=10`;

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "x-token": token
        }
      });

      const data = await res.json();
      setUsuarios(data.usuarios || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    fetchUsuarios(search, page);
  }, [page]);

  // 🔍 Autocomplete en vivo
  const handleChange = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length > 1) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3000/api/usuarios?search=${encodeURIComponent(value)}&limit=5`,
          { headers: { "x-token": token } }
        );
        const data = await res.json();
        setSugerencias(data.usuarios || []);
      } catch (error) {
        console.error("Error buscando sugerencias:", error);
        setSugerencias([]);
      }
    } else {
      // 🔄 si se borra la búsqueda, mostrar todos
      setSugerencias([]);
      fetchUsuarios("", 1);
    }
  };

  const handleSelectSugerencia = (cliente) => {
    setSearch(cliente.correo);
    setSugerencias([]);
    setUsuarios([cliente]); // mostrar solo ese cliente
  };

  const handleBloquear = async (id, estado) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-token": token
        },
        body: JSON.stringify({ estado: !estado }),
      });
      const data = await res.json();
      setUsuarios((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...data.usuario } : u))
      );
    } catch (error) {
      console.error("Error bloqueando usuario:", error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: "DELETE",
        headers: { "x-token": token }
      });
      setUsuarios((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  // Filtrar según solapa
  const usuariosFiltrados = usuarios.filter((u) =>
    tab === "activos" ? u.estado === true : u.estado === false
  );

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <h3 className="mb-4 text-center">Usuarios Registrados</h3>

          {/* 🔍 Buscador con autocomplete */}
          <Form className="mb-3">
            <Form.Control
              type="text"
              placeholder="Buscar por nombre, apellido o correo"
              value={search}
              onChange={handleChange}
            />
            {sugerencias.length > 0 && (
              <ListGroup className="mt-2">
                {sugerencias.map((u) => (
                  <ListGroup.Item
                    key={u._id}
                    action
                    onClick={() => handleSelectSugerencia(u)}
                  >
                    {u.nombre} {u.apellido} - {u.correo}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form>

          {/* 🗂 Tabs Activos/Bloqueados */}
          <Tabs activeKey={tab} onSelect={(k) => setTab(k)} className="mb-3">
            <Tab eventKey="activos" title="Activos" />
            <Tab eventKey="bloqueados" title="Bloqueados" />
          </Tabs>

          {/* 🧾 Tabla */}
          <div className="table-responsive">
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((u) => (
                    <tr key={u._id}>
                      <td>{u?.nombre ?? "Sin nombre"}</td>
                      <td>{u?.apellido ?? "Sin apellido"}</td>
                      <td>{u?.correo ?? "Sin correo"}</td>
                      <td>{u?.rol ?? "Sin rol"}</td>
                      <td>{u?.estado ? "Activo" : "Inhabilitado"}</td>
                      <td className="d-flex flex-column flex-md-row gap-2">
                        <Button
                          variant={u.estado ? "warning" : "success"}
                          size="sm"
                          className="w-100 w-md-auto"
                          onClick={() => handleBloquear(u._id, u.estado)}
                        >
                          {u.estado ? "Bloquear" : "Activar"}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="w-100 w-md-auto"
                          onClick={() => handleEliminar(u._id)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No hay usuarios para mostrar</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* 📄 Paginación */}
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
        </Col>
      </Row>
    </Container>
  );
};

export default AdminUsuarios;


