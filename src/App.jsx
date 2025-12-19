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

import ProtectedRoute from "./components/ProtectedRoute";
import CheckoutPage from "./PagesPrincipal/CheckoutPage";
import CheckoutResult from "./PagesPrincipal/CheckoutResult";
import BuscarPage from "./PagesPrincipal/BuscarPage";

function App() {
  return (
    <div className="layout">
      <NavigateApp />
      <main className="main-content container mt-4 flex-grow-1">
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<Inicio />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/categoria/:nombre" element={<CategoriaPage />} />
          <Route path="/detalle/:id" element={<DetalleProducto />} />
          <Route path="/cuenta" element={<Cuenta />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/checkout/:id" element={<CheckoutPage tipo="compra" />} />
          <Route path="/checkout-carrito" element={<CheckoutPage tipo="carrito" />} />

          <Route path="/checkout/success/:id" element={<CheckoutResult tipo="success" />} />
          <Route path="/checkout/failure/:id" element={<CheckoutResult tipo="failure" />} />
          <Route path="/checkout/pending/:id" element={<CheckoutResult tipo="pending" />} />

          <Route path="/buscar" element={<BuscarPage />} />

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
    </div>
  );
}

export default App;

