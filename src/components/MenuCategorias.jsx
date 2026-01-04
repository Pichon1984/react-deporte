import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const MenuCategorias = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categorias`);
      const data = await res.json();
      setCategorias(data.categorias || []);
    };
    fetchCategorias();
  }, []);

  return (
    <nav>
      <ul>
        {categorias.map((cat) => (
          <li key={cat._id}>
            <Link to={`/categoria/${cat._id}`}>{cat.nombre}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MenuCategorias;
