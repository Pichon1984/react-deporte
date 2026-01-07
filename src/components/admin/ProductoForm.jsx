import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Image, Spinner, Table } from 'react-bootstrap';

const ProductoForm = ({ productoInicial = {}, onGuardar, onCancelar }) => {
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    stock: '',
    descripcion: '',
    tallesTexto: '',
    imagenes: [],
    // nuevo: unidades por talle [{talle:'S', stock:10}]
    tallesUnidades: [],
    ...productoInicial,
  });

  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [urlTemporal, setUrlTemporal] = useState('');

  // 📌 Normalizar datos cuando llega productoInicial (para edición)
  useEffect(() => {
    if (productoInicial && productoInicial._id) {
      setProducto({
        ...productoInicial,
        precio: productoInicial.precio?.toString() || "",
        tallesTexto:
          Array.isArray(productoInicial.talles) && productoInicial.talles.length > 0
            ? productoInicial.talles.join(", ")
            : productoInicial.tallesTexto || "",
        imagenes: productoInicial.imagenes || [],
        tallesUnidades: Array.isArray(productoInicial.tallesUnidades)
          ? productoInicial.tallesUnidades
          : [], // si no existe, iniciamos vacío
      });
    }
  }, [productoInicial]);

  // 📥 Traer categorías desde backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categorias`);
        const data = await res.json();
        setCategorias(data.categorias || data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "precio") {
      // normalizamos: quitamos puntos de miles y usamos punto como decimal
      const valorNormalizado = value.replace(/\./g, "").replace(",", ".");
      setProducto(prev => ({ ...prev, precio: valorNormalizado }));
    } else {
      setProducto(prev => ({ ...prev, [name]: value }));
    }
  };

  // 🧮 Helpers de talles/unidades
  const agregarFilaTalle = () => {
    setProducto(prev => ({
      ...prev,
      tallesUnidades: [...(prev.tallesUnidades || []), { talle: '', stock: 0 }],
    }));
  };

  const cambiarFilaTalle = (index, campo, valor) => {
    setProducto(prev => {
      const copia = [...(prev.tallesUnidades || [])];
      copia[index] = {
        ...copia[index],
        [campo]: campo === 'stock' ? Number(valor) || 0 : valor,
      };
      return { ...prev, tallesUnidades: copia };
    });
  };

  const eliminarFilaTalle = (index) => {
    setProducto(prev => ({
      ...prev,
      tallesUnidades: (prev.tallesUnidades || []).filter((_, i) => i !== index),
    }));
  };

  const handleGuardar = () => {
    if (!producto.nombre || !producto.precio || !producto.categoria) {
      alert('Campos obligatorios: nombre, precio, categoría');
      return;
    }
    if (isNaN(parseFloat(producto.precio)) || parseFloat(producto.precio) <= 0) {
      alert('El precio debe ser un número válido mayor a 0.');
      return;
    }
    if (!producto.imagenes || producto.imagenes.length === 0) {
      alert('Debes subir al menos una imagen antes de guardar.');
      return;
    }

    // talles desde texto (para compatibilidad) y consolidación con tallesUnidades
    const tallesDesdeTexto = producto.tallesTexto
      ? producto.tallesTexto.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    // si hay tallesUnidades, derivamos talles únicos desde ahí
    const tallesDesdeUnidades = (producto.tallesUnidades || [])
      .map(tu => tu.talle?.trim())
      .filter(Boolean);

    const tallesUnicos = Array.from(new Set([...(tallesDesdeTexto || []), ...(tallesDesdeUnidades || [])]));

    // stock total (opcional): suma de unidades por talle si existen, sino el campo stock general
    const stockTotal =
      (producto.tallesUnidades || []).length > 0
        ? (producto.tallesUnidades || []).reduce((acc, tu) => acc + (Number(tu.stock) || 0), 0)
        : Number(producto.stock) || 0;

    const nuevoProducto = {
      ...producto,
      categoria: producto.categoria,
      talles: tallesUnicos,
      tallesUnidades: (producto.tallesUnidades || []).map(tu => ({
        talle: (tu.talle || '').trim(),
        stock: Number(tu.stock) || 0,
      })),
      // precio normalizado a número con 2 decimales
      precio: Number(parseFloat(producto.precio).toFixed(2)),
      // stock total (si tu modelo lo usa como agregado)
      stock: Number(stockTotal),
      fechaCreacion: producto.fechaCreacion || new Date().toISOString(),
    };

    onGuardar(nuevoProducto);

    if (!productoInicial._id) {
      setProducto({
        nombre: '',
        precio: '',
        categoria: '',
        stock: '',
        descripcion: '',
        tallesTexto: '',
        imagenes: [],
        tallesUnidades: [],
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
              type="text"
              value={producto.precio}
              onChange={handleChange}
              placeholder="Ej: 120000"
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
            <Form.Label>Stock general (opcional)</Form.Label>
            <Form.Control
              name="stock"
              type="number"
              value={producto.stock}
              onChange={handleChange}
              placeholder="Se calcula desde talles si los cargas"
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
              placeholder="Ej: S, M, L, 38, 39"
            />
          </Form.Group>

          {/* 🧩 Unidades por talle */}
          <Form.Group className="mb-3">
            <Form.Label>Unidades por talle</Form.Label>
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Talle</th>
                  <th>Unidades</th>
                  <th style={{ width: 100 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {(producto.tallesUnidades || []).map((tu, i) => (
                  <tr key={i}>
                    <td>
                      <Form.Control
                        value={tu.talle}
                        onChange={(e) => cambiarFilaTalle(i, 'talle', e.target.value)}
                        placeholder="Ej: S, M, 38"
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={tu.stock}
                        onChange={(e) => cambiarFilaTalle(i, 'stock', e.target.value)}
                        min={0}
                      />
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => eliminarFilaTalle(i)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3}>
                    <Button variant="outline-primary" size="sm" onClick={agregarFilaTalle}>
                      + Agregar talle
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
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
