import { Modal } from 'react-bootstrap';
import ProductoForm from './ProductoForm';

const ProductoModal = ({ show, onHide, producto, onGuardar }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{producto?.id ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {producto && (
          <ProductoForm
            productoInicial={producto}
            onGuardar={onGuardar}
            onCancelar={onHide}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProductoModal;

