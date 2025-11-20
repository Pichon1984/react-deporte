import { useState } from 'react';
import { Spinner, Form } from 'react-bootstrap';

const CloudinaryUpload = ({ onUpload }) => {
  const [cargando, setCargando] = useState(false);

  const handleUpload = async (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

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
      console.log('Respuesta Cloudinary:', data);

      if (data.secure_url) {
        onUpload(data.secure_url);
      } else {
        alert('Error al subir imagen a Cloudinary: ' + data.message);
        console.error(data);
      }
    } catch (error) {
      alert('Error de red al subir imagen');
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Form.Group>
      <Form.Control type="file" onChange={handleUpload} disabled={cargando} />
      {cargando && <Spinner animation="border" size="sm" className="mt-2" />}
    </Form.Group>
  );
};

export default CloudinaryUpload;

