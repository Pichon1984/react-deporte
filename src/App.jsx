import React from "react";
import { Routes, Route } from "react-router-dom";

import NavigateApp from "./components/NavigateApp";
import Footer from "./components/Footer";

import Inicio from "./PagesPrincipal/Inicio";
import Contacto from "./PagesPrincipal/Contacto";
import { Nosotros } from "./PagesPrincipal/Nosotros";
import Cuenta from "./PagesPrincipal/Cuenta";
import Carrito from "./PagesPrincipal/Carrito";
import Registro from "./PagesPrincipal/Registro";
import DetalleProducto from "./components/DetalleProducto";
import Admin from "./PagesPrincipal/Admin";
import Error404Page from "./PagesPrincipal/Error404Page";
import ClientePage from "./PagesPrincipal/ClientePage";
import ResetPasswordPage from "./PagesPrincipal/ResetPasswordPage";
import ForgotPasswordPage from "./PagesPrincipal/ForgotPasswordPage";
import CategoriaPage from "./components/CategoriaPage";

import ProtectedRoute from "./components/ProtectedRoute"; // 👈 ahora correcto
import CheckoutPage from "./PagesPrincipal/CheckoutPage";

function App() {
  return (
    <>
      <NavigateApp />
      <main className="main-content container mt-4">
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<Inicio />} /> {/* 👈 home */}
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/Nosotros" element={<Nosotros />} />
          <Route path="/Contacto" element={<Contacto />} />
          <Route path="/Carrito" element={<Carrito />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/categoria/:nombre" element={<CategoriaPage />} />
          <Route path="/detalle/:id" element={<DetalleProducto />} />
          <Route path="/Cuenta" element={<Cuenta />} />
          <Route path="/registro" element={<Registro />} />
           <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Páginas privadas */}
          <Route
            path="/cliente"
            element={
              <ProtectedRoute roles={["CLIENTE", "ADMIN"]}>
                <ClientePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Error 404 */}
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;


