import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const InfoProducto = ({ nombre, precio, descripcion, talles, enlaceCarrito }) => {
  const [talle, setTalle] = useState('M');
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="mb-3">{nombre}</h2>
      <h4 className="text-success mb-3">Precio: {precio}</h4>
      <p style={{ whiteSpace: 'pre-line' }}>{descripcion}</p>


      <Form.Group className="mb-3">
        <Form.Label>Selecciona tu talle:</Form.Label>
        <Form.Select value={talle} onChange={(e) => setTalle(e.target.value)}>
          {talles.map((t, i) => (
            <option key={i} value={t}>{t}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button href={enlaceCarrito} variant="primary" className="me-2">
        Agregar al carrito
      </Button>
      <div className="mt-4">
      
      </div>
    </div>
  );
};

export default InfoProducto;

