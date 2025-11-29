import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import  Inicio  from './PagesPrincipal/Inicio';
import Contacto from './PagesPrincipal/Contacto';
import { Nosotros } from './PagesPrincipal/Nosotros';
import Cuenta from './PagesPrincipal/Cuenta';
import Carrito from './PagesPrincipal/Carrito';

import Registro from './PagesPrincipal/Registro';
import Calzado from './PagesPrincipal/Calzado';
import Indumentaria from './PagesPrincipal/Indumentaria';
import Accesorios from './PagesPrincipal/Accesorios';
import NavigateApp  from './components/NavigateApp';
import Footer from './components/Footer';
import DetalleProducto from './components/DetalleProducto';
import Admin from './PagesPrincipal/Admin';
import ProtectedRoutesAdmin from './routes/ProtectedRoutesAdmin';
import Error404Page from './PagesPrincipal/Error404Page';
import ClientePage from './PagesPrincipal/ClientePage';
import RegisterComponent from './components/RegisterComponent';
import ResetPasswordPage from './PagesPrincipal/ResetPasswordPage';
import ForgotPasswordPage from './PagesPrincipal/ForgotPasswordPage';





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
            <Route path="/Nosotros" element={<Nosotros />} />
            <Route path="/Contacto" element={<Contacto />} />
            <Route path="/Ingresa o Registrate" element={<Cuenta />} />
            <Route path="/Carrito" element={<Carrito />} />
            <Route path="/Registro" element={<Registro />} />
            <Route path="/Calzado" element={<Calzado />} />
            <Route path="/Indumentaria" element={<Indumentaria />} />
            <Route path="/detalle/:id" element={<DetalleProducto />} />
            <Route path="/Accesorios" element={<Accesorios />} />
            <Route path="/cliente" element={<ClientePage />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage/>}/>
            <Route path='/reset-password' element={<ResetPasswordPage/>}/>
            <Route path="/" element={<RegisterComponent />} />






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



