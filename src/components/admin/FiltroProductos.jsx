import { Form, Row, Col } from 'react-bootstrap';

const FiltroProductos = ({ filtros, setFiltros }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Form className="mt-3">
      <Row>
        <Col md={4}>
          <Form.Control
            placeholder="Buscar por nombre"
            name="nombre"
            value={filtros.nombre}
            onChange={handleChange}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            name="categoria"
            value={filtros.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar categoría</option>
           <option value="Indumentaria">Indumentaria</option>
              <option value="Calzado">Calzado</option>
              <option value="Accesorios">Accesorios</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Control
            placeholder="Filtrar por talle"
            name="talle"
            value={filtros.talle}
            onChange={handleChange}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default FiltroProductos;

