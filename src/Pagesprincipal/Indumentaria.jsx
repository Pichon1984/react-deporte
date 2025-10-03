import Productos from '../components/Producto';

import camiseta from '../assets/img/camiseta-de-argentina-adidas-oficial-blanc-removebg-preview.png';
import buzo from '../assets/img/buzo-con-capucha-puma-f1-ess-motorsport-logo-violeta-removebg-preview.png';
import campera from '../assets/img/campera-puma-bmw-m-motorsport-negra-47352278-640020627457001-1-removebg-preview.png';


const productosIndumentaria = [
 
  {
    id: 1,
    nombre: 'Camiseta Argentina Adidas Blanca',
    precio: '$139.999',
    imagen: camiseta,
  },
  {
    id: 2,
    nombre: 'Buzo Puma F1 Violeta',
    precio: '$97.499',
    imagen: buzo,
  },
  {
    id: 3,
    nombre: 'Campera BMW Negra',
    precio: '$142.999',
    imagen: campera,
  },
  


];

const Indumentaria = () => {
  return <Productos titulo="Indumentaria destacada" productos={productosIndumentaria} />;
};

export default Indumentaria;

