
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterComponent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    usuario: '',
    email: '',
    contraseña: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevoCliente = {
      id: Date.now().toString(),
      ...form,
      rol: 'cliente',
    };
    localStorage.setItem('cliente', JSON.stringify(nuevoCliente));
    navigate('/cliente');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* campos de registro */}
      <button type="submit">Registrarme</button>
    </form>
  );
};

export default RegisterComponent;

