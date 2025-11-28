import { useEffect, useState } from 'react';
import InfoProducto from '../components/InfoProducto';

const CategoriaPage = ({ categoria, titulo }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('productos')) || [];

    const filtrados = guardados.filter(
      p => p?.categoria?.toLowerCase() === categoria.toLowerCase()
    );

    setProductos(filtrados);
  }, [categoria]);

  return <InfoProducto titulo={titulo} productos={productos} />;
};

export default CategoriaPage;

