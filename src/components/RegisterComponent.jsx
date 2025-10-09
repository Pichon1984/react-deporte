import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const RegisterComponent = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-start min-vh-100"
      style={{ backgroundColor: '#caedfd', paddingTop: '60px' }}>
  <div className="p-4 rounded-4 shadow-lg bg-white mb5" style={{ width: '100%', maxWidth: '420px' }}>
        <h2 className="text-center mb-4">Registro</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre completo</label>
            <input type="text" className="form-control rounded-pill" id="nombre" name="nombre" required />
          </div>

          <div className="mb-3">
            <label htmlFor="usuario" className="form-label">Usuario</label>
            <input type="text" className="form-control rounded-pill" id="usuario" name="usuario" required />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control rounded-pill" id="email" name="email" required />
          </div>

          <div className="mb-3">
            <label htmlFor="celular" className="form-label">Celular</label>
            <input type="text" className="form-control rounded-pill" id="celular" name="celular" required />
          </div>

          <div className="mb-3">
            <label htmlFor="codigo" className="form-label">Código postal</label>
            <input type="text" className="form-control rounded-pill" id="codigo" name="codigo" required />
          </div>

          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input type="text" className="form-control rounded-pill" id="direccion" name="direccion" required />
          </div>

          <div className="mb-4">
            <label htmlFor="contraseña" className="form-label">Contraseña</label>
            <input type="password" className="form-control rounded-pill" id="contraseña" name="contraseña" required />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary rounded-pill">Registrarme</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterComponent;


