
import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/FormularioContacto.css';
import logo from '../assets/img/logo.png';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID_CONTACT = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;


export default function FormularioContacto() {
  const formRef = useRef();
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = e => {
  e.preventDefault();

  emailjs
    .sendForm(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_CONTACT,
      formRef.current,
      EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setEnviado(true);
      setError(false);
      formRef.current.reset();
    })
    .catch((error) => {
      console.error('Error al enviar:', error);
      setError(true);
    });
};




  return (
    <main>
      <div className="container my-5">
        <div className="row align-items-center justify-content-center g-4">

          <div className="col-12 col-md-5 text-center">
            <img src={logo} alt="Logo de Pichón" style={{ width: '300px' }} />
          </div>

     
          <div className="col-12 col-md-6">
            <h2 className="text-center mb-4">Contáctanos</h2>

            {enviado && <div className="alert alert-success">¡Mensaje enviado con éxito!</div>}
            {error && <div className="alert alert-danger">Hubo un error al enviar el mensaje.</div>}

            <form ref={formRef} onSubmit={handleSubmit} className="form">
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Tu nombre"
                required
              />

              <label htmlFor="email">Correo electrónico:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Tu correo"
                required
              />

              <label htmlFor="message">Mensaje:</label>
              <textarea
                id="message"
                name="message"
                placeholder="Escribe tu mensaje aquí..."
                rows="6"
                required
              />

              <button type="submit" id="button">Enviar</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}


