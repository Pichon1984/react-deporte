import { useEffect, useState } from 'react';
import InfoProducto from '../components/InfoProducto';

const Indumentaria = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('productos')) || [];

    const filtrados = guardados.filter(
      p => p?.categoria?.toLowerCase() === 'indumentaria'
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

export default Indumentaria;



