
import '../styles/inicio.css'
import { Carousel, Card, Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';


import Desktop from '../assets/img/Desktop.webp';
import Desktop2 from '../assets/img/Desktop2.webp';
import Desktop3 from '../assets/img/Desktop3.webp';
import zapatilla from '../assets/img/zapatilla-adidas-grand-court-alpha-00s-mujer-rosa-100010jh8669001-1-removebg-preview.png';
import camiseta from '../assets/img/camiseta-de-argentina-adidas-oficial-blanc-removebg-preview.png';
import pelota from '../assets/img/pelota-de-futbol-adidas-messi-mini-rosa-100040jm4756001-1-removebg-preview.png';





export function Inicio() {
  return (
    <>
      <div className="carousel-wrapper">
        <Carousel>
          <Carousel.Item>
            <img src={Desktop} className="d-block w-100" alt="Futurista" />
            <Carousel.Caption>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src={Desktop2} className="d-block w-100" alt="Humano" />
            <Carousel.Caption>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src={Desktop3} className="d-block w-100" alt="Minimalista" />
            <Carousel.Caption>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      {/* Título */}
      <Container className="my-5">
        <h1 className="text-center mb-4">Lanzamientos</h1>

        {/* Cards */}
        <Row className="g-4 justify-content-center">
  <Col md={4}>
    <Card className="h-100 text-center">
      <Link to="/calzado" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Card.Img
          variant="top"
          src={zapatilla}
          style={{ height: '200px', objectFit: 'contain' }}
        />
        <Card.Body>
          <Card.Title>Calzados</Card.Title>
        </Card.Body>
      </Link>
    </Card>
  </Col>

  <Col md={4}>
    <Card className="h-100 text-center">
      <Link to="/indumentaria" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Card.Img
          variant="top"
          src={camiseta}
          style={{ height: '200px', objectFit: 'contain' }}
        />
        <Card.Body>
          <Card.Title>Indumentarias</Card.Title>
        </Card.Body>
      </Link>
    </Card>
  </Col>

  <Col md={4}>
    <Card className="h-100 text-center">
      <Link to="/accesorios" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Card.Img
          variant="top"
          src={pelota}
          style={{ height: '200px', objectFit: 'contain' }}
        />
        <Card.Body>
          <Card.Title>Accesorios</Card.Title>
        </Card.Body>
      </Link>
    </Card>
  </Col>
</Row>


      </Container>

    </>
  )
}
export default Inicio;



