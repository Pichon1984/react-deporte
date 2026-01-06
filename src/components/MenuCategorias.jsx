import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategorias } from "../services/api";

const MenuCategorias = () => {
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

  return (
    <nav>
      <ul>
        {categorias.map((cat) => (
          <li key={cat._id}>
            {/* ✅ Usamos siempre _id, funciona en local y producción */}
<Link to={`/categoria/${cat._id}`}>{cat.nombre}</Link>

          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MenuCategorias;
