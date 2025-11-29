import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    email: '',
    celular: '',
    codigo: '',
    direccion: '',
    contraseña: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

   
    const nuevoUsuario = {
      id: Date.now().toString(),
      nombre: formData.nombre,
      usuario: formData.usuario,
      email: formData.email,
      celular: formData.celular,
      codigo: formData.codigo,
      direccion: formData.direccion,
      contraseña: formData.contraseña,
      rol: 'cliente',      
      bloqueado: false,
    };

    const usuarios = JSON.parse(localStorage.getItem('usuarios-admin')) || [];
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios-admin', JSON.stringify(usuarios));

    alert('Usuario registrado con éxito ✅');
    navigate('/Ingresa o Registrate'); 
  };

  return (
    <div
      className="d-flex justify-content-center align-items-start min-vh-100"
      style={{ backgroundColor: '#caedfd', paddingTop: '60px' }}
    >
      <div className="p-4 rounded-4 shadow-lg bg-white mb5" style={{ width: '100%', maxWidth: '420px' }}>
        <h2 className="text-center mb-4">Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre completo</label>
            <input type="text" className="form-control rounded-pill" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label htmlFor="usuario" className="form-label">Usuario</label>
            <input type="text" className="form-control rounded-pill" id="usuario" name="usuario" value={formData.usuario} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control rounded-pill" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label htmlFor="celular" className="form-label">Celular</label>
            <input type="text" className="form-control rounded-pill" id="celular" name="celular" value={formData.celular} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label htmlFor="codigo" className="form-label">Código postal</label>
            <input type="text" className="form-control rounded-pill" id="codigo" name="codigo" value={formData.codigo} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input type="text" className="form-control rounded-pill" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
          </div>

          <div className="mb-4">
            <label htmlFor="contraseña" className="form-label">Contraseña</label>
            <input type="password" className="form-control rounded-pill" id="contraseña" name="contraseña" value={formData.contraseña} onChange={handleChange} required />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary rounded-pill">Registrarme</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;

