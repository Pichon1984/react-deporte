import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

const ProductoModal = ({ show, onHide, producto, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoria: "",
    stock: "",
    descripcion: "",
    talles: "",
    imagenes: [],
  });

  const [categorias, setCategorias] = useState([]); // siempre array

  // ✅ cargar categorías desde backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/categorias", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setCategorias(data);
        } else if (Array.isArray(data.categorias)) {
          setCategorias(data.categorias);
        } else {
          setCategorias([]);
          console.error("Respuesta inesperada:", data);
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
        setCategorias([]);
      }
    };
    fetchCategorias();
  }, []);

  // ✅ cargar producto si es edición
  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || "",
        precio: producto.precio || "",
        categoria: producto.categoria?._id || producto.categoria || "",
        stock: producto.stock || "",
        descripcion: producto.descripcion || "",
        talles: (producto.talles || []).join(", "),
        imagenes: producto.imagenes || [],
        _id: producto._id || null,
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    const nuevoProducto = {
      ...formData,
      talles: formData.talles.split(",").map((t) => t.trim()),
    };
    onGuardar(nuevoProducto);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{formData._id ? "Editar Producto" : "Nuevo Producto"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
            />
          </Form.Group>

          {/* 👇 Select dinámico de categorías */}
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
            >
              <option value="">Seleccionar categoría</option>
              {Array.isArray(categorias) &&
                categorias.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Talles (separados por coma)</Form.Label>
            <Form.Control
              type="text"
              name="talles"
              value={formData.talles}
              onChange={handleChange}
            />
          </Form.Group>

          {/* 👇 Imagen desde PC */}
          <Form.Group className="mb-3">
            <Form.Label>Imagen desde PC</Form.Label>
            <Form.Control
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formDataFile = new FormData();
                formDataFile.append("file", file);
                formDataFile.append("upload_preset", CLOUDINARY_PRESET);

                try {
                  const res = await fetch(CLOUDINARY_URL, {
                    method: "POST",
                    body: formDataFile,
                  });
                  const data = await res.json();

                  if (data.secure_url) {
                    setFormData((prev) => ({
                      ...prev,
                      imagenes: [...prev.imagenes, data.secure_url],
                    }));
                  } else {
                    console.error("❌ Cloudinary error:", data);
                    alert("Error al subir imagen a Cloudinary");
                  }
                } catch (error) {
                  console.error("❌ Error subiendo imagen:", error);
                  alert("Error de red al subir imagen");
                }
              }}
            />
          </Form.Group>

          {/* 👇 Imagen por URL */}
          <Form.Group className="mb-3">
            <Form.Label>Imagen por URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (e.target.value) {
                    setFormData((prev) => ({
                      ...prev,
                      imagenes: [...prev.imagenes, e.target.value],
                    }));
                    e.target.value = "";
                  }
                }
              }}
            />
          </Form.Group>

          {/* 👇 Previsualización */}
          <div className="mt-2 d-flex flex-wrap gap-2">
            {formData.imagenes.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="preview"
                style={{ width: "60px", height: "60px", objectFit: "cover" }}
              />
            ))}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductoModal;



