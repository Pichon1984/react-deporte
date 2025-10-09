import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import logoworkify from '../assets/img/logoworkify.png';
const LoginComponent = () => {
  return (
    <div className="container-fluid py-5" id="contenedoriniciosesion">
      <div className="row justify-content-center align-items-center">
    
        <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center">
          <img src={logoworkify} alt="Logo de Workify" style={{ width: '300px', height: 'auto' }} />
        </div>

       
        <div className="col-md-6 col-lg-4 px-4">
          <h1 className="mb-4 text-center">Iniciar sesión</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo electrónico:</label>
              <input type="email" className="form-control" id="correo" name="correo" required />
            </div>
            <div className="mb-3">
              <label htmlFor="contraseña" className="form-label">Contraseña:</label>
              <input type="password" className="form-control" id="contraseña" name="contraseña" required />
            </div>
            <div className="mb-3 text-end">
              <Link to="/404" className="text-decoration-none">Olvidé mi contraseña</Link>
            </div>
            <div className="d-grid mb-3">
              <Link to="/404" className="btn btn-danger">Iniciar sesión</Link>
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


