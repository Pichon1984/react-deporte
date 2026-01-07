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
            // ✅ aseguramos que se envíe el _id de la categoría
            const productoFinal = {
              ...nuevo,
              categoria: nuevo.categoria, // ya es el _id seleccionado en el <Form.Select>
            };
            onGuardar(productoFinal);
            // ❌ no cerramos aquí el modal
            // ✅ dejamos que Admin.jsx lo cierre cuando el guardado sea exitoso
          }}
          onCancelar={onHide}
        />
      </Modal.Body>
    </Modal>
  );
};

export default ProductoModal;
