



import { useState, useEffect } from "react";
import { Container, Tab, Nav, Row, Col, Card, Button, Form } from "react-bootstrap";

const provincias = ["Buenos Aires", "Córdoba", "Santa Fe", "Tucumán"];
const ciudadesPorProvincia = {
  "Buenos Aires": ["La Plata", "Mar del Plata", "Bahía Blanca"],
  "Córdoba": ["Córdoba", "Villa María", "Río Cuarto"],
  "Santa Fe": ["Rosario", "Santa Fe", "Rafaela"],
  "Tucumán": ["San Miguel", "Famaillá", "Tafí Viejo"],
};

const ClientPage = () => {
  const [cliente, setCliente] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    celular: "",
    documento: "",
    direccion: "",
    provincia: "",
    ciudad: "",
    codigo: "",
  });

  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");


    fetch("http://localhost:3000/api/usuarios/me", {
      headers: { "x-token": token }
    })
      .then(res => res.json())
      .then(data => {
        setCliente(data);
        setForm({
          nombre: data.nombre || "",
          email: data.email || "",
          celular: data.celular || "",
          documento: data.documento || "",
          direccion: data.direccion || "",
          provincia: data.provincia || "",
          ciudad: data.ciudad || "",
          codigo: data.codigo || "",
        });
      });

    fetch("http://localhost:3000/api/compras", {
      headers: { "x-token": token }
    })
      .then(res => res.json())
      .then(data => setCompras(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/api/usuarios/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-token": token
      },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        setCliente(data);
        setEditando(false);
        alert("Datos actualizados");
      });
  };

  return (
    <Container className="my-5">
      <Card className="shadow-sm">
        <Card.Body>
          <Tab.Container defaultActiveKey="datos">
            <Row>
              <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item><Nav.Link eventKey="datos" active>Mis datos</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link eventKey="compras" active>Mis compras</Nav.Link></Nav.Item>
                  <Nav.Item><Nav.Link eventKey="direcciones" active>Mis direcciones</Nav.Link></Nav.Item>
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
              
                  <Tab.Pane eventKey="datos">
                    <h4 className="mb-3">Información de contacto</h4>
                    {editando ? (
                      <>
                        <Form.Group className="mb-2">
                          <Form.Label>Nombre</Form.Label>
                          <Form.Control name="nombre" value={form.nombre} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Email</Form.Label>
                          <Form.Control name="email" value={form.email} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Celular</Form.Label>
                          <Form.Control name="celular" value={form.celular} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Documento</Form.Label>
                          <Form.Control name="documento" value={form.documento} onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" onClick={handleGuardar} className="me-2">Guardar</Button>
                        <Button variant="secondary" onClick={() => setEditando(false)}>Cancelar</Button>
                      </>
                    ) : (
                      <>
                        <p><strong>Nombre:</strong> {cliente?.nombre}</p>
                        <p><strong>Email:</strong> {cliente?.email}</p>
                        <p><strong>Celular:</strong> {cliente?.celular}</p>
                        <p><strong>Documento:</strong> {cliente?.documento}</p>
                        <Button variant="primary" onClick={() => setEditando(true)}>Editar</Button>
                      </>
                    )}
                  </Tab.Pane>

            
                  <Tab.Pane eventKey="compras">
                    <h4 className="mb-3">Historial de compras</h4>
                    {compras.length === 0 ? (
                      <p>No tienes compras registradas.</p>
                    ) : (
                      <ul>
                        {compras.map((c) => (
                          <li key={c._id}>
                            {c.producto.nombre} – {new Date(c.fecha).toLocaleDateString()} – ${c.total.toLocaleString("es-AR")}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Tab.Pane>

         
                  <Tab.Pane eventKey="direcciones">
                    <h4 className="mb-3">Dirección de envío</h4>
                    {editando ? (
                      <>
                        <Form.Group className="mb-2">
                          <Form.Label>Dirección</Form.Label>
                          <Form.Control name="direccion" value={form.direccion} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Provincia</Form.Label>
                          <Form.Select name="provincia" value={form.provincia} onChange={handleChange}>
                            <option value="">Seleccionar provincia</option>
                            {provincias.map((prov) => (
                              <option key={prov} value={prov}>{prov}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Ciudad</Form.Label>
                          <Form.Select name="ciudad" value={form.ciudad} onChange={handleChange}>
                            <option value="">Seleccionar ciudad</option>
                            {(ciudadesPorProvincia[form.provincia] || []).map((ciudad) => (
                              <option key={ciudad} value={ciudad}>{ciudad}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-2">
                          <Form.Label>Código Postal</Form.Label>
                          <Form.Control name="codigo" value={form.codigo} onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" onClick={handleGuardar} className="me-2">Guardar</Button>
                        <Button variant="secondary" onClick={() => setEditando(false)}>Cancelar</Button>
                      </>
                    ) : (
                      <>
                        <p><strong>Dirección:</strong> {cliente?.direccion}</p>
                        <p><strong>Provincia:</strong> {cliente?.provincia}</p>
                        <p><strong>Ciudad:</strong> {cliente?.ciudad}</p>
                        <p><strong>Código Postal:</strong> {cliente?.codigo}</p>
                        <Button variant="primary" onClick={() => setEditando(true)}>Editar</Button>
                      </>
                    )}
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClientPage;

