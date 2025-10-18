import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';

const LoginComponent = ({ logIn }) => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

   
    if (correo === 'admin@workify.com' && contraseña === '1234') {
      logIn();
      navigate('/Admin'); 
    } else {
      alert('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="container-fluid py-5" id="contenedoriniciosesion">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
          <img src={logo} alt="Logo" style={{ width: '300px', height: 'auto' }} />
        </div>

        <div className="col-md-6 col-lg-4 px-4">
          <h1 className="mb-4 text-center">Iniciar sesión</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo electrónico:</label>
              <input
                type="email"
                className="form-control"
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="contraseña" className="form-label">Contraseña:</label>
              <input
                type="password"
                className="form-control"
                id="contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 text-end">
              <Link to="/404" className="text-decoration-none">Olvidé mi contraseña</Link>
            </div>
            <div className="d-grid mb-3">
              <button type="submit" className="btn btn-danger">Iniciar sesión</button>
            </div>
          </form>

          <div className="mb-3">
            <a
              href="https://accounts.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-start gap-2"
            >
              <i className="bi bi-google" style={{ fontSize: '1.2rem' }}></i>
              <span>Continuar con Google</span>
            </a>
          </div>
          <div className="mb-4">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-start gap-2"
            >
              <i className="bi bi-facebook" style={{ fontSize: '1.2rem' }}></i>
              <span>Continuar con Facebook</span>
            </a>
          </div>

          <div className="text-center">
            <Link to="/registro" className="text-decoration-none">Registrarme</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;

