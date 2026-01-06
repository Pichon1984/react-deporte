import '../styles/inicio.css'
import { Carousel, Card, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCategorias } from '../services/api'; // 👈 servicio que trae categorías

import Desktop from '../assets/img/Desktop.webp';
import Desktop2 from '../assets/img/Desktop2.webp';
import Desktop3 from '../assets/img/Desktop3.webp';
import zapatilla from '../assets/img/zapatilla-adidas-grand-court-alpha-00s-mujer-rosa-100010jh8669001-1-removebg-preview.png';
import camiseta from '../assets/img/camiseta-de-argentina-adidas-oficial-blanc-removebg-preview.png';
import pelota from '../assets/img/pelota-de-futbol-adidas-messi-mini-rosa-100040jm4756001-1-removebg-preview.png';

// Importá el modal
import PromoModal from '../components/PromoModal';

export function Inicio() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const respuesta = await getCategorias();
      if (respuesta.ok) {
        setCategorias(respuesta.data.categorias || []);
      }
    };
    fetchCategorias();
  }, []);

  // Mapeo de imágenes según nombre (normalizado en minúsculas)
  const imagenesPorNombre = {
    calzado: zapatilla,
    indumentaria: camiseta,
    accesorios: pelota,
  };

  return (
    <>
      {/* Modal de promoción */}
      <PromoModal />

      <div className="carousel-wrapper">
        <Carousel>
          <Carousel.Item>
            <img src={Desktop} className="d-block w-100" alt="Futurista" />
          </Carousel.Item>
          <Carousel.Item>
            <img src={Desktop2} className="d-block w-100" alt="Humano" />
          </Carousel.Item>
          <Carousel.Item>
            <img src={Desktop3} className="d-block w-100" alt="Minimalista" />
          </Carousel.Item>
        </Carousel>
      </div>

      {/* Título */}
      <Container className="my-5">
        <h1 className="text-center mb-4">Lanzamientos</h1>

        {/* Cards dinámicas */}
        <Row className="g-4 justify-content-center">
          {categorias.map((cat) => (
            <Col key={cat._id} md={4}>
              <Card className="h-100 text-center">
                <Link
                  to={`/categoria/${cat._id}`} // 👈 ahora usamos _id
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Card.Img
                    variant="top"
                    src={imagenesPorNombre[cat.nombre.toLowerCase()] || '/placeholder.jpg'}
                    style={{ height: '200px', objectFit: 'contain' }}
                  />
                  <Card.Body>
                    <Card.Title>{cat.nombre}</Card.Title>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Inicio;
