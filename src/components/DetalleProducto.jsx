import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Accordion,
  Toast,
  ToastContainer,
  Alert,
  Badge
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { CarritoContext } from '../context/CarritoContext';
import ListaConsultas from '../components/ListaConsultas';

import MiniaturasCarrusel from '../components/carrusel/MiniaturasCarrusel';
import ImagenPrincipal from '../components/carrusel/ImagenPrincipal';

function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [talleSeleccionado, setTalleSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [mostrarToast, setMostrarToast] = useState(false);
  const { agregarProducto } = useContext(CarritoContext);

  const [mensajeConsulta, setMensajeConsulta] = useState('');
  const [envioSeleccionado, setEnvioSeleccionado] = useState('');
  const [cuotasMP, setCuotasMP] = useState([]);
  const [envioAndreani, setEnvioAndreani] = useState(null);

  const [expandido, setExpandido] = useState(false);
  const limiteDescripcion = 250;

  const [refreshConsultas, setRefreshConsultas] = useState(false);

  // Cargar producto
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/productos/${id}`);
        const data = await res.json();
        setProducto(data.producto || data);
      } catch (error) {
        console.error('Error cargando producto:', error);
      }
    };
    if (id) fetchProducto();
  }, [id]);

  // Cuotas MercadoPago
  useEffect(() => {
    const fetchCuotas = async () => {
      try {
        const metodos = ['visa', 'master', 'naranja'];
        const resultados = await Promise.all(
          metodos.map(async (metodo) => {
            const res = await fetch(
              `http://localhost:3000/api/cuotas?amount=${producto.precio}&payment_method_id=${metodo}`
            );
            const data = await res.json();
            return {
              metodo,
              issuer: data[0]?.issuer?.name || metodo,
              cuotas: data[0]?.payer_costs || []
            };
          })
        );
        setCuotasMP(resultados);
      } catch (error) {
        console.error('Error cargando cuotas MercadoPago:', error);
      }
    };
    if (producto?.precio) fetchCuotas();
  }, [producto]);

  // Envío Andreani
  useEffect(() => {
    const fetchEnvioAndreani = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/envios/andreani?origen=1000&destino=4000&peso=${producto.peso || 1}`
        );
        const data = await res.json();
        setEnvioAndreani(data);
      } catch (error) {
        console.error('Error obteniendo envío Andreani:', error);
      }
    };
    if (producto) fetchEnvioAndreani();
  }, [producto]);

  if (!producto) return <h2 className="text-center py-5">Producto no encontrado</h2>;

  const imagenes = (producto.imagenes && producto.imagenes.length > 0)
    ? producto.imagenes
    : [producto.img || '/placeholder.jpg'];

  const descripcionVisible =
    producto.descripcion?.length > limiteDescripcion && !expandido
      ? producto.descripcion.substring(0, limiteDescripcion) + '…'
      : producto.descripcion;

  const handleAgregar = () => {
    if (producto.talles?.length && !talleSeleccionado) {
      alert('Seleccioná un talle');
      return;
    }
    if (cantidad < 1 || cantidad > (producto.stock || 0)) {
      alert(`Solo hay ${producto.stock} unidad(es) disponible(s)`);
      return;
    }
    if (producto.envio?.metodos?.length > 0 && !envioSeleccionado) {
      alert('Seleccioná un método de envío');
      return;
    }

    agregarProducto(producto, talleSeleccionado || 'único', cantidad, envioSeleccionado);

    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 3000);
  };

  const handleEnviarConsulta = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para enviar una consulta');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/consultas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-token': token
        },
        body: JSON.stringify({
          productoId: producto._id,
          mensaje: mensajeConsulta
        })
      });
      const data = await res.json();
      if (data.ok) {
        alert('Consulta enviada correctamente');
        setMensajeConsulta('');
        setRefreshConsultas((prev) => !prev);
      } else {
        alert('Error al enviar consulta');
      }
    } catch (error) {
      console.error('Error enviando consulta:', error);
      alert('Error al enviar consulta');
    }
  };

  return (
    <Container className="py-5">
      <Row className="align-items-start">
        <Col xs={12} md={7} className="mb-3">
          <ImagenPrincipal imagen={imagenes[selectedIndex] || '/placeholder.jpg'} />
          <div className="mt-3">
            <MiniaturasCarrusel
              imagenes={imagenes}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
          </div>
        </Col>

        <Col xs={12} md={5}>
          <h2>{producto.nombre}</h2>
          <p className="text-muted">Código: {producto._id}</p>
          <p className="text-muted">Categoría: {producto.categoria?.nombre || producto.categoria}</p>

          <div className="descripcion">
            {descripcionVisible?.split('\n').map((linea, i) => (
              <p key={i} className="mb-1">{linea}</p>
            ))}
            {producto.descripcion?.length > limiteDescripcion && (
              <Button variant="link" className="p-0 mt-2" onClick={() => setExpandido(!expandido)}>
                {expandido ? 'Ver menos' : 'Ver más'}
              </Button>
            )}
          </div>

          <h4 className="text-success mt-3 d-flex align-items-center gap-2">
            ${producto.precio}
            {(producto.stock || 0) === 0 && <Badge bg="secondary">Sin stock</Badge>}
          </h4>

          {(producto.stock || 0) === 0 && (
            <Alert variant="warning" className="mt-2 mb-0">
              Sin stock por el momento. Podés dejar una consulta y te avisamos cuando haya disponibilidad.
            </Alert>
          )}

          {/* Talles en cuadrados */}
          {producto.talles?.length > 0 && (
            <div className="mt-3">
              <h5>Talles disponibles</h5>
              <div className="d-flex flex-wrap gap-2">
                {producto.talles.map((talle, idx) => (
                  <Button
                    key={idx}
                    variant={talleSeleccionado === talle ? 'primary' : 'outline-secondary'}
                    onClick={() => setTalleSeleccionado(talle)}
                    style={{ minWidth: '60px' }}
                    disabled={(producto.stock || 0) === 0}
                  >
                    {talle}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div className="mt-3">
            <h5>Cantidad</h5>
            <Form.Control
              type="number"
              min={1}
              max={producto.stock || 1}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              disabled={(producto.stock || 0) === 0}
            />
            <small className="text-muted">Stock disponible: {producto.stock || 0}</small>
          </div>

          {/* Métodos de envío con descripción y costo */}
          {producto.envio?.metodos?.length > 0 && (
            <div className="mt-3">
              <h5>Métodos de envío</h5>
              {producto.envio.metodos.map((metodo, idx) => (
                <Form.Check
                  key={idx}
                  type="radio"
                  name="envio"
                  label={`${metodo.nombre} - ${metodo.descripcion} ($${metodo.costo})`}
                  value={metodo.nombre}
                  checked={envioSeleccionado === metodo.nombre}
                  onChange={(e) => setEnvioSeleccionado(e.target.value)}
                  disabled={(producto.stock || 0) === 0}
                />
              ))}
            </div>
          )}

          {/* Envío Andreani (cotización) */}
          {envioAndreani && (
            <div className="mt-3">
              <h5>Envío con Andreani</h5>
              <p>Costo estimado: ${envioAndreani.costo}</p>
              <p>Tiempo estimado: {envioAndreani.tiempo} días</p>
            </div>
          )}

          {/* Cuotas MercadoPago */}
          <div className="mt-3">
            <h5>Cuotas con MercadoPago</h5>
            {cuotasMP.length > 0 ? (
              <Accordion>
                {cuotasMP.map((grupo, idx) => (
                  <Accordion.Item eventKey={idx.toString()} key={idx}>
                    <Accordion.Header>
                      {grupo.issuer} ({grupo.metodo.toUpperCase()})
                    </Accordion.Header>
                    <Accordion.Body>
                      {grupo.cuotas.map((c, i) => (
                        <Form.Check
                          key={i}
                          type="radio"
                          name={`cuotas-${grupo.metodo}`}
                          label={c.recommended_message}
                          value={c.installments}
                          disabled={(producto.stock || 0) === 0}
                        />
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted">Financiación disponible al pagar con MercadoPago</p>
            )}
          </div>

          <Button
            variant="primary"
            onClick={handleAgregar}
            disabled={(producto.stock || 0) === 0}
            className="mt-3"
          >
            Agregar al carrito
          </Button>
        </Col>
      </Row>

      {/* Consultas */}
      <Row className="mt-4">
        <Col xs={12}>
          <h5>Consultas de otros clientes</h5>
          <ListaConsultas productoId={producto._id} refresh={refreshConsultas} />

          <Form.Group className="mt-3">
            <Form.Label>Tu pregunta</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={mensajeConsulta}
              onChange={(e) => setMensajeConsulta(e.target.value)}
            />
          </Form.Group>
          <Button className="mt-2" variant="primary" onClick={handleEnviarConsulta}>
            Enviar consulta
          </Button>
        </Col>
      </Row>

      {/* Toast de confirmación */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg="success"
          show={mostrarToast}
          onClose={() => setMostrarToast(false)}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Carrito</strong>
            <small>Ahora</small>
          </Toast.Header>
          <Toast.Body>✅ Producto agregado al carrito</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default DetalleProducto;

