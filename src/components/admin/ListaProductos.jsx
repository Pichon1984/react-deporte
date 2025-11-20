import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ListaProductos = ({ productos, onEditar, onEliminar }) => {
  return (
    <div className="row mt-3 mb-4">
      {productos.map((p) => (
        <div key={p.id} className="col-md-4 mb-3">
          <Card className="h-100 shadow-sm" style={{ minHeight: '280px', fontSize: '0.9rem' }}>
            <Link
              to={`/detalle/${p.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Card.Img
                variant="top"
                src={p.imagen || p.imagenes?.[0] || '/placeholder.jpg'}
                alt={p.nombre}
                style={{ height: '140px', objectFit: 'cover' }}
              />
              <Card.Body className="pb-2">
                <Card.Title style={{ fontSize: '1rem' }}>{p.nombre}</Card.Title>
                <Card.Text>
                  <strong>Precio:</strong> ${p.precio}<br />
                  <strong>Stock:</strong> {p.stock}<br />
                  <strong>Categoría:</strong> {p.categoria}
                </Card.Text>
              </Card.Body>
            </Link>
            <div className="px-3 pb-3 d-flex justify-content-between">
              <button className="btn btn-warning btn-sm" onClick={() => onEditar(p)}>
                Editar
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onEliminar(p.id)}>
                Eliminar
              </button>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ListaProductos;

