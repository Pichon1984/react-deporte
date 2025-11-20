import { useEffect, useState } from 'react';
import InfoProducto from '../components/InfoProducto';

const Calzado = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('productos')) || [];

    const filtrados = guardados.filter(
      p => p?.categoria?.toLowerCase() === 'calzado'
    );

    setProductos(filtrados);
  }, []);

  return (
    <>
      {productos.map((p, i) => (
        <InfoProducto key={i} producto={p} />
      ))}
    </>
  );
};

export default Calzado;

