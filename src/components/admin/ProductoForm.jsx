import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Image, Spinner } from 'react-bootstrap';

const ProductoForm = ({ productoInicial = {}, onGuardar, onCancelar }) => {
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    stock: '',
    descripcion: '',
    tallesTexto: '',
    imagenes: [],
    ...productoInicial, // 👈 si viene un producto para editar, se carga aquí
  });

  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [urlTemporal, setUrlTemporal] = useState('');

  // 📥 Traer categorías desde backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categorias`);
        const data = await res.json();
        // si tu backend devuelve { categorias: [...] }
        setCategorias(data.categorias || data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    if (!producto.nombre || !producto.precio || !producto.categoria) {
      alert('Campos obligatorios: nombre, precio, categoría');
      return;
    }
    if (isNaN(Number(producto.precio)) || Number(producto.precio) <= 0) {
      alert('El precio debe ser un número válido mayor a 0.');
      return;
    }
    if (!producto.imagenes || producto.imagenes.length === 0) {
      alert('Debes subir al menos una imagen antes de guardar.');
      return;
    }

    const talles = producto.tallesTexto
      ? producto.tallesTexto.split(',').map(t => t.trim()).filter(Boolean)
      : producto.talles || [];

    const nuevoProducto = {
      ...producto,
      categoria: producto.categoria, // 👈 aquí ya es el _id seleccionado
      talles,
      fechaCreacion: producto.fechaCreacion || new Date().toISOString(),
    };

    console.log("Categoría seleccionada (ID):", producto.categoria);
    console.log("Producto a guardar:", nuevoProducto);

    onGuardar(nuevoProducto);

    // reset form solo si es creación, no edición
    if (!productoInicial._id) {
      setProducto({
        nombre: '',
        precio: '',
        categoria: '',
        stock: '',
        descripcion: '',
        tallesTexto: '',
        imagenes: [],
      });
      setUrlTemporal('');
    }
  };

  // 📷 Subir imagen a Cloudinary
  const subirImagen = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!tiposPermitidos.includes(archivo.type)) {
      alert('Solo se permiten imágenes JPG, PNG o WEBP');
      return;
    }

    setCargando(true);

    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET);

    try {
      const res = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setProducto(prev => ({
          ...prev,
          imagenes: [...(prev.imagenes || []), data.secure_url],
        }));
      } else {
        alert('Error al subir imagen');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red al subir imagen');
    } finally {
      setCargando(false);
    }
  };

  const agregarUrlManual = () => {
    const url = urlTemporal.trim();
    const esValida = /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(url);
    if (!esValida) {
      alert('La URL debe ser válida y terminar en .jpg, .jpeg, .png o .webp');
      return;
    }
    setProducto(prev => ({
      ...prev,
      imagenes: [...(prev.imagenes || []), url],
    }));
    setUrlTemporal('');
  };

  const eliminarImagen = (index) => {
    if (window.confirm('¿Eliminar esta imagen?')) {
      setProducto(prev => ({
        ...prev,
        imagenes: (prev.imagenes || []).filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <Form>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="nombre"
              value={producto.nombre}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              name="precio"
              type="number"
              value={producto.precio}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria"
              value={producto.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar categoría</option>
              {Array.isArray(categorias) && categorias.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              name="stock"
              type="number"
              value={producto.stock}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="descripcion"
              value={producto.descripcion}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Talles (separados por coma)</Form.Label>
            <Form.Control
              name="tallesTexto"
              value={producto.tallesTexto}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subir imagen desde tu dispositivo</Form.Label>
            <Form.Control type="file" onChange={subirImagen} />
            {cargando && <Spinner animation="border" size="sm" className="ms-2" />}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Agregar imagen por URL</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                value={urlTemporal}
                onChange={(e) => setUrlTemporal(e.target.value)}
                placeholder="https://..."
              />
              <Button
                variant="success"
                className="ms-2"
                onClick={agregarUrlManual}
                disabled={!urlTemporal.trim()}
              >
                Agregar
              </Button>
            </div>
          </Form.Group>

          <div className="d-flex flex-wrap mt-2">
            {producto.imagenes?.map((img, i) => (
              <div key={i} className="me-2 mb-2 position-relative">
                <Image src={img} thumbnail width={80} height={80} />
                <Button
                  variant="danger"
                  size="sm"
                  className="mt-1 w-100"
                  onClick={() => eliminarImagen(i)}
                >
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      <div className="mt-3 d-flex justify-content-end">
        <Button variant="secondary" onClick={onCancelar} className="me-2">
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGuardar}>
          Guardar
        </Button>
      </div>
    </Form>
  );
};

export default ProductoForm;


