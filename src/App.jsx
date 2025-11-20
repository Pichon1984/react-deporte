import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { Inicio } from './Pagesprincipal/Inicio';
import Contacto from './Pagesprincipal/Contacto';
import { Nosotros } from './Pagesprincipal/Nosotros';
import Cuenta from './Pagesprincipal/Cuenta';
import Carrito from './Pagesprincipal/Carrito';
import { Categorias } from './Pagesprincipal/Categorias';
import { Registro } from './Pagesprincipal/Registro';
import Calzado from './Pagesprincipal/Calzado';
import Indumentaria from './Pagesprincipal/Indumentaria';
import  Accesorios  from './Pagesprincipal/Accesorios';
import { NavigateApp } from './components/NavigateApp';
import Footer from './components/Footer';
import DetalleProducto from './components/DetalleProducto';
import Admin from './Pagesprincipal/Admin';
import ProtectedRoutesAdmin from './routes/ProtectedRoutesAdmin';
import Error404Page from './Pagesprincipal/Error404Page';

function App() {
  const auth = useContext(AuthContext);
  if (!auth) return <div>Error: el contexto de autenticación no está disponible.</div>;

  const { usuario, logIn, logOut } = auth;

  return (
    <BrowserRouter>
      <CarritoProvider>
        <NavigateApp logIn={logIn} logOut={logOut} auth={!!usuario} />

        <main className="main-content container mt-4">
          <Routes>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/Cuenta" element={<Cuenta logIn={logIn} />} />
            <Route path="/Categoria" element={<Categorias />} />
            <Route path="/Nosotros" element={<Nosotros />} />
            <Route path="/Contacto" element={<Contacto />} />
            <Route path="/Ingresa o Registrate" element={<Cuenta />} />
            <Route path="/Carrito" element={<Carrito />} />
            <Route path="/Registro" element={<Registro />} />
            <Route path="/Calzado" element={<Calzado />} />
            <Route path="/Indumentaria" element={<Indumentaria />} />
            <Route path="/detalle/:id" element={<DetalleProducto />} />
            <Route path="/Accesorios" element={<Accesorios />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoutesAdmin auth={usuario?.rol === 'admin'}>
                  <Admin />
                </ProtectedRoutesAdmin>
              }
            />


            <Route path="*" element={<Error404Page />} />
          </Routes>
        </main>

        <Footer />
      </CarritoProvider>
    </BrowserRouter>
  );
}

export default App;



