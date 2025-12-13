import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUsuarios = async (searchTerm = "") => {
    try {
      const res = await fetch("http://localhost:3000/api/usuarios", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      setUsuarios(data.usuarios || []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    fetchUsuarios(search);
  };

  const handleBloquear = async (id, estado) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ estado: !estado }),
      });
      const data = await res.json();
      setUsuarios((prev) =>
        prev.map((u) => (u._id === id ? data.usuario : u))
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
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setUsuarios((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <h3 className="mb-4 text-center">Usuarios Registrados</h3>

          {/* 🔍 Buscador responsive */}
          <Form onSubmit={handleBuscar} className="mb-3 d-flex flex-column flex-md-row gap-2">
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o correo"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" variant="primary" className="w-100 w-md-auto">
              Buscar
            </Button>
          </Form>

          {/* 🧾 Tabla responsive */}
          <div className="table-responsive">
            <Table striped bordered hover>
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
                {usuarios.length > 0 ? (
                  usuarios.map((u) => (
                    <tr key={u._id}>
                      <td>{u.nombre}</td>
                      <td>{u.apellido}</td>
                      <td>{u.correo}</td>
                      <td>{u.rol}</td>
                      <td>{u.estado ? "Activo" : "Inhabilitado"}</td>
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
        </Col>
      </Row>
    </Container>
  );
};

export default AdminUsuarios;

