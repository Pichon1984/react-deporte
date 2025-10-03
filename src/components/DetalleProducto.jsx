import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';


import MiniaturasCarrusel from '../components/carrusel/MiniaturasCarrusel';
import ImagenPrincipal from '../components/carrusel/ImagenPrincipal';
import InfoProducto from '../components/InfoProducto';

import img1 from '../assets/img/camiseta-de-argentina-adidas-oficial-blanc-removebg-preview.png';
import img2 from '../assets/img/cami01.png';
import img3 from '../assets/img/cami2.png';
import img4 from '../assets/img/cami3.png';
import img5 from '../assets/img/buzo-con-capucha-puma-f1-ess-motorsport-logo-violeta-removebg-preview.png';
import img6 from '../assets/img/buso1.png';
import img7 from '../assets/img/buso2.png';



const productos = [
  {
    id: 1,
    nombre: 'Camiseta De Argentina Adidas Titular Authentic 24 Blanca',
    precio: '$135000',
    imagenes: [img1, img2, img3, img4],
    descripcion: `Vestite como un campeón. La camiseta titular de Argentina representa un juego y compromiso incomparables. 
    HEAT.RDY controla la temperatura para que entrenes al máximo, con tejido que absorbe el sudor al instante. 
    Hecho con materiales reciclados. Logo ADIDAS, escudo AFA, escudo FIFA y sol estampados.`,
    talles: ['S', 'M', 'L', 'XL'],
    enlaceCarrito: '/carrito',
  },
  {
    id: 2,
    nombre: 'Buzo Con Capucha Puma F1 ESS Motorsport Logo Violeta',
    precio: '$135.000',
    imagenes: [img5, img6, img7, img5],
    descripcion: `Este buzo con capucha F1® ESS Logo fue diseñado para los auténticos fans.
Luce un gigante logo F1® en el pecho.
Nos vemos en el próximo gran premio.
Está hecho con algodón de la Iniciativa Forever Better, que ayuda a apoyar un cultivo de algodón más sostenible.
Capucha con cordón de ajuste.
Cintura y puños elastizados.
Bolsillo canguro.
Logo PUMA estampado.
Sin frisa.`,
    talles: ['S', 'M', 'L', 'XL'],
    enlaceCarrito: '/carrito',
  }
];

function DetalleProducto() {
  const { id } = useParams();
  const producto = productos.find(p => p.id === parseInt(id));
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!producto) return <h2 className="text-center py-5">Producto no encontrado</h2>;

  return (
    <Container className="py-5">
      <Row className="align-items-start">


        <Col xs={12} md={2}>
          <MiniaturasCarrusel
            imagenes={producto.imagenes}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </Col>
        <Col xs={12} md={5}>

          <ImagenPrincipal imagen={producto.imagenes[selectedIndex]} />
        </Col>
        <Col xs="12" md={5}>

          <InfoProducto
            nombre={producto.nombre}
            precio={producto.precio}
            descripcion={producto.descripcion}
            talles={producto.talles}
            enlaceCarrito={producto.enlaceCarrito}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default DetalleProducto;

