import React, { useContext } from 'react';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { NavLink, useNavigate, Link } from "react-router-dom";
import { CarritoContext } from '../context/CarritoContext';
import { AuthContext } from '../context/AuthContext';
import '../styles/NavigateApp.css';
import logo from '../assets/img/logo.png';
import SearchInput from './SearchInput';



export const NavigateApp = ({ logOut }) => {
  const { carrito } = useContext(CarritoContext);
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();


  const auth = !!usuario;

  const calcularTotal = () => {
    if (!Array.isArray(carrito)) return 0;

    return carrito.reduce((total, item) => {
      const precioNumerico = typeof item.precio === 'string'
        ? parseFloat(item.precio.replace(/[^0-9.-]+/g, '')) || 0
        : Number(item.precio) || 0;

      return total + precioNumerico * item.cantidad;
    }, 0);
  };


  const handleLogout = async () => {
    await logOut();
    navigate("/home", { replace: true });
  };




  return (
    <Navbar expand="lg" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/inicio" className="d-flex align-items-center">
          <img src={logo} alt="Logo de Pichón" style={{ width: '150px', height: 'auto' }} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Categorías" id="nav-dropdown">
              <NavDropdown.Item as={NavLink} to="/Calzado">Calzado</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/Indumentaria">Indumentaria</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/Accesorios">Accesorios</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={NavLink} to="/Nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/Contacto">Contacto</Nav.Link>
            <SearchInput />
          </Nav>

          <div className="d-flex align-items-center gap-2">
            {usuario?.rol === 'admin' && (
              <Nav.Link as={NavLink} to="/admin">Admin</Nav.Link>
            )}
            {usuario?.rol === 'cliente' && (
              <Nav.Link as={NavLink} to="/cliente">
                Hola, {usuario.nombre}
              </Nav.Link>
            )}



            {auth ? (
              <Button variant="outline-light" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            ) : (
              <Button as={NavLink} to="/Ingresa o Registrate" variant="outline-light">
                Inicio de sesión
              </Button>
            )}



            <NavDropdown
              title={
                <span className="position-relative">
                  <i className="bi bi-cart-fill fs-3 text-white" aria-label="Carrito"></i>
                  {carrito.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {carrito.length}
                    </span>
                  )}
                </span>
              }
              id="carrito-dropdown"
              align="end"
            >
              {carrito.length === 0 ? (
                <NavDropdown.Item disabled>El carrito está vacío</NavDropdown.Item>
              ) : (
                <>
                  {carrito.map((item, index) => (
                    <NavDropdown.Item
                      key={index}
                      className="d-flex align-items-center gap-2"
                      as={Link}
                      to="/Carrito"
                    >
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                        onError={(e) => {
                          e.target.src = '/assets/img/default.png';
                        }}
                      />
                      <div className="d-flex flex-column">
                        <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{item.nombre}</span>
                        <small className="text-muted">Talle: {item.talle} – {item.precio}</small>
                      </div>
                    </NavDropdown.Item>
                  ))}
                  <NavDropdown.Divider />
                  <NavDropdown.Item disabled>
                    <h4>Total: ${calcularTotal()?.toLocaleString('es-AR') || '0'}</h4>
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Carrito">
                    Ver carrito completo
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigateApp;

