import React, { useContext, useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown, Button, OverlayTrigger, Popover, Spinner } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import { CarritoContext } from '../context/CarritoContext';
import { AuthContext } from '../context/AuthContext';
import { BsCart } from "react-icons/bs";
import '../styles/NavigateApp.css';
import logo from '../assets/img/logo.png';
import SearchInput from './SearchInput';
import { getCategorias } from '../services/api'; 

export const NavigateApp = () => {
  const { carrito } = useContext(CarritoContext);
  const { usuario, logOut } = useContext(AuthContext);

  const [categorias, setCategorias] = useState([]);
  const [loadingCategorias, setLoadingCategorias] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const respuesta = await getCategorias();
        if (respuesta.ok) {
          setCategorias(respuesta.data.categorias || []);
        }
      } catch (error) {
        console.error("❌ Error cargando categorías:", error);
      } finally {
        setLoadingCategorias(false);
      }
    };
    fetchCategorias();
  }, []);

  const auth = !!usuario;

  const calcularTotal = () => {
    if (!Array.isArray(carrito)) return 0;
    return carrito.reduce((total, item) => {
      const precioNumerico = Number(item.productoId?.precio || 0);
      return total + precioNumerico * item.cantidad;
    }, 0);
  };

  const handleLogout = () => {
    logOut(); 
  };

  const popover = (
    <Popover id="popover-carrito" className="shadow">
      <Popover.Header as="h3">Carrito</Popover.Header>
      <Popover.Body>
        {carrito.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <>
            <ul className="list-unstyled mb-2">
              {carrito.slice(0, 3).map((item) => (
                <li key={item.productoId?._id}>
                  {item.productoId?.nombre} x{item.cantidad} – $
                  {(Number(item.productoId?.precio || 0) * item.cantidad).toLocaleString("es-AR")}
                </li>
              ))}
              {carrito.length > 3 && <li>… y más productos</li>}
            </ul>
            <strong>Total: ${calcularTotal().toLocaleString("es-AR")}</strong>
            <div className="mt-2">
              <Button as={NavLink} to="/carrito" size="sm" variant="primary">
                Ver carrito
              </Button>
            </div>
          </>
        )}
      </Popover.Body>
    </Popover>
  );

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
              {loadingCategorias ? (
                <NavDropdown.Item>
                  <Spinner animation="border" size="sm" /> Cargando...
                </NavDropdown.Item>
              ) : categorias.length > 0 ? (
                categorias.map((cat) => (
                  <NavDropdown.Item
                    key={cat._id}
                    as={NavLink}
                    to={`/categoria/${cat._id}`}
                  >
                    {cat.nombre}
                  </NavDropdown.Item>
                ))
              ) : (
                <NavDropdown.Item disabled>No hay categorías</NavDropdown.Item>
              )}
            </NavDropdown>

            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
            <SearchInput />
          </Nav>

         <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            <OverlayTrigger trigger={["hover", "focus"]} placement="bottom" overlay={popover}>
              <Nav.Link as={NavLink} to="/carrito" className="position-relative">
                <BsCart size={22} />
                {carrito.length > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {carrito.length}
                  </span>
                )}
              </Nav.Link>
            </OverlayTrigger>

            {usuario && (
              <Nav.Link as={NavLink} to={`/${usuario.rol.toLowerCase()}`}>
                {usuario.rol === 'ADMIN' ? 'Admin' : `Hola, ${usuario.nombre}`}
              </Nav.Link>
            )}

            {auth ? (
              <Button variant="outline-light" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            ) : (
              <Button as={NavLink} to="/cuenta" variant="outline-light">
                Inicio de sesión
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigateApp;
