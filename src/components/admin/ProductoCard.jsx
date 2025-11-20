import { Card, Button } from 'react-bootstrap';

const ProductoCard = ({ producto, onEditar, onEliminar }) => {
  return (
    <Card className="h-100 text-center shadow-sm">
      <Card.Img
        variant="top"
        src={producto.imagen}
        alt={producto.nombre}
        style={{ height: '200px', objectFit: 'contain' }}
      />
      <Card.Body>
        <h5>{producto.nombre}</h5>
        <p>Categoría: {producto.categoria}</p>
        <p>Precio: ${producto.precio}</p>
        <p>Stock: {producto.stock}</p>
        <p>Talles: {(producto.talles || []).join(', ') || 'N/A'}</p>
        <div className="d-flex justify-content-center gap-2 mt-2">
          <Button variant="warning" onClick={onEditar}>Editar</Button>
          <Button variant="danger" onClick={onEliminar}>Eliminar</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductoCard;

