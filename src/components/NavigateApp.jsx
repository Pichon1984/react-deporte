import React from 'react';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import logo from '../assets/img/logo.png';
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
/>


export const NavigateApp = ({ logIn, logOut, auth }) => {
  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/Inicio" className="d-flex align-items-center">
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
          </Nav>

          <div className="d-flex align-items-center gap-3 ">
            {
              auth && (<Nav.Link as={NavLink} to="/Admin">Admin</Nav.Link>)
            }

            {auth ? (
              <>

                <Button variant="outline-light" onClick={logOut}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button as={NavLink} to="/Cuenta" variant="outline-light">
                Inicio de sesión
              </Button>
            )}
            <NavLink to="/Carrito" className="text-white text-decoration-none position-relative">
              <i className="bi bi-cart-fill fs-6"></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                0
              </span>
            </NavLink>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default NavigateApp;


