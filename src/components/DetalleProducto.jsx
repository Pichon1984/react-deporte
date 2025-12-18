import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Accordion } from 'react-bootstrap';
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

  // ✅ cargar producto
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

  // ✅ traer cuotas reales de MercadoPago
  useEffect(() => {
    const fetchCuotas = async () => {
      try {
        const metodos = ["visa", "master", "naranja"];
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
        console.error("Error cargando cuotas MercadoPago:", error);
      }
    };
    if (producto?.precio) fetchCuotas();
  }, [producto]);

  // ✅ traer cotización de envío con Andreani
  useEffect(() => {
    const fetchEnvioAndreani = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/envios/andreani?origen=1000&destino=4000&peso=${producto.peso || 1}`
        );
        const data = await res.json();
        setEnvioAndreani(data);
      } catch (error) {
        console.error("Error obteniendo envío Andreani:", error);
      }
    };
    if (producto) fetchEnvioAndreani();
  }, [producto]);

  if (!producto) return <h2 className="text-center py-5">Producto no encontrado</h2>;

  const handleAgregar = () => {
    if (producto.talles?.length && !talleSeleccionado) {
      alert('Seleccioná un talle');
      return;
    }
    if (cantidad < 1 || cantidad > producto.stock) {
      alert(`Solo hay ${producto.stock} unidades disponibles`);
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
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para enviar una consulta");
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
      } else {
        alert('Error al enviar consulta');
      }
    } catch (error) {
      console.error('Error enviando consulta:', error);
      alert('Error al enviar consulta');
    }
  };

  const imagenes = (producto.imagenes && producto.imagenes.length > 0)
    ? producto.imagenes
    : [producto.img || '/placeholder.jpg'];

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
          <p>{producto.descripcion}</p>
          <h4 className="text-success">${producto.precio}</h4>

          {/* 👟 Selección de talles */}
          {producto.talles?.length > 0 && (
            <div className="mt-3">
              <h5>Selecciona un talle</h5>
              {producto.talles.map((talle) => (
                <Button
                  key={talle}
                  variant={talleSeleccionado === talle ? "primary" : "outline-primary"}
                  className="me-2 mb-2"
                  onClick={() => setTalleSeleccionado(talle)}
                >
                  {talle}
                </Button>
              ))}
            </div>
          )}

          {/* 📦 Opciones de envío */}
          <div className="mt-3">
            <h5>Opciones de envío</h5>
            {envioAndreani ? (
              <p><strong>Andreani:</strong> ${envioAndreani.price} - {envioAndreani.estimated_days} días</p>
            ) : (
              <p className="text-muted">Consultando envío con Andreani...</p>
            )}
          </div>

          <Button
            variant="primary"
            onClick={handleAgregar}
            disabled={producto.stock === 0}
            className="mt-3"
          >
            Agregar al carrito
          </Button>

          {/* 💳 Cuotas reales con MercadoPago */}
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
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h5>Consultas de otros clientes</h5>
          <ListaConsultas productoId={producto._id} />

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
    </Container>
  );
}

export default DetalleProducto;

