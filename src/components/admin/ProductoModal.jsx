import { Modal } from "react-bootstrap";
import ProductoForm from "./ProductoForm";

const ProductoModal = ({ show, onHide, producto, onGuardar }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {producto?._id ? "Editar Producto" : "Nuevo Producto"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProductoForm
          productoInicial={producto}
          onGuardar={(nuevo) => {
       
            const productoFinal = {
              ...nuevo,
              categoria: nuevo.categoria, 
            };
            onGuardar(productoFinal);
          
          }}
          onCancelar={onHide}
        />
      </Modal.Body>
    </Modal>
  );
};

export default ProductoModal;
