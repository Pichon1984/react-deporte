import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css'; // Opcional para estilos personalizados
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import logo from '../assets/img/logo.png';


const Footer = () => {
 
    const currentYear = new Date().getFullYear();

  return (
   <footer className="bg-dark text-white pt-4 mt-auto">
  <div className="container">
    <div className="row text-center text-md-start">
      <div className="col-md-4 border-end border-light pe-4 mb-3">
        <img src={logo} alt="Logo de Pichón" style={{ width: '150px' }} />
        <p className="mt-3 mb-0">📧 contacto@pichoncalzados.com</p>
        <p>📞 +54 381 1234567</p>
      </div>

      <div className="col-md-4 border-end border-light px-4 mb-3">
        <NavLink to="/" className="d-block text-white text-decoration-none mb-2">Inicio</NavLink>
        <NavLink to="/Productos" className="d-block text-white text-decoration-none mb-2">Productos</NavLink>
        <NavLink to="/Contacto" className="d-block text-white text-decoration-none mb-2">Contacto</NavLink>
        <NavLink to="/Carrito" className="d-block text-white text-decoration-none">Carrito</NavLink>
      </div>

      <div className="col-md-4 ps-4 mb-3 text-md-end text-center">
        <div className="mb-2">
          <a href="https://facebook.com" className="text-white me-3"><FaFacebookF /></a>
          <a href="https://instagram.com" className="text-white me-3"><FaInstagram /></a>
          <a href="https://wa.me/543811234567" className="text-white"><FaWhatsapp /></a>
        </div>
        <p className="mb-0">&copy; {currentYear} Pichón Calzados</p>
        <p>Todos los derechos reservados</p>
      </div>
    </div>
  </div>
</footer>


  );
};

export default Footer;

