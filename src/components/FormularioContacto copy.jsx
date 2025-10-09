import { useState } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/FormularioContacto.css';
import logoworkify from '../assets/img/logoworkify.png';

export default function FormularioContacto() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    emailjs
      .send('service_s8s8jye', 'template_4g8wmzs', formData, '5AOsvGiQmW8qjZ3UZ')
      .then(() => {
        setEnviado(true);
        setError(false);
        setFormData({ name: '', email: '', message: '' });
      })
      .catch(() => {
        setError(true);
        setEnviado(false);
      });
  };

  return (
    <main>
      <div className="container my-5">
        <div className="row align-items-center justify-content-center g-4">
        
          <div className="col-12 col-md-5 text-center">
           <img src={logoworkify} alt="Logo de workify" style={{ width: '300px', height: 'auto' }} />
          </div>

        
          <div className="col-12 col-md-6">
            <h2 className="text-center mb-4">Contáctanos</h2>

            {enviado && <div className="alert alert-success">¡Mensaje enviado con éxito!</div>}
            {error && <div className="alert alert-danger">Hubo un error al enviar el mensaje.</div>}

            <form onSubmit={handleSubmit} className="form">
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="email">Correo electrónico:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Tu correo"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label htmlFor="message">Mensaje:</label>
              <textarea
                id="message"
                name="message"
                placeholder="Escribe tu mensaje aquí..."
                rows="6"
                value={formData.message}
                onChange={handleChange}
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


