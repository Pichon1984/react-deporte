import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import { Inicio } from './Pagesprincipal/Inicio';
import { Contacto } from './Pagesprincipal/Contacto';
import { Nosotros } from './Pagesprincipal/Nosotros';
import { Cuenta } from './Pagesprincipal/Cuenta';
import { Carrito } from './Pagesprincipal/Carrito';
import { Categorias } from './Pagesprincipal/Categorias';
import { Registro } from './Pagesprincipal/Registro';
import { Calzado } from './Pagesprincipal/Calzado';
import Indumentaria from './Pagesprincipal/Indumentaria';
import { Accesorios } from './Pagesprincipal/Accesorios';
import { NavigateApp } from './components/NavigateApp';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from './components/Footer';
import DetalleProducto from './components/DetalleProducto';






function App() {
  return (
    <BrowserRouter>
      <div >
        <NavigateApp />
        <main className="main-content container mt-4">
          <Routes>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/Categoria" element={<Categorias />} />
            <Route path="/Nosotros" element={<Nosotros />} />
            <Route path="/Contacto" element={<Contacto />} />
            <Route path="/Ingresa o Registrate" element={<Cuenta />} />
            <Route path="/Carrito" element={<Carrito />} />
            <Route path="/Registro" element={<Registro />} />
            <Route path="/Calzado" element={<Calzado />} />
            <Route path="/Indumentaria" element={<Indumentaria />} />
            <Route path="/detalle/:id" element={<DetalleProducto/>}/>
            <Route path="/Accesorios" element={<Accesorios />} />
          </Routes>
        </main>
      </div>
       <Footer/>
    </BrowserRouter>
    
  );
}
export default App;

