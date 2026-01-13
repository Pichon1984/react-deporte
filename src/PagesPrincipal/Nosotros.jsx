import React from 'react'
import { Container } from 'react-bootstrap';
import ComentariosClientes from '../components/ComentariosClientes';



export const Nosotros = () => {
  return (
    <>
      <Container className="my-5">
        <h1 className="text-center mb-4">Acerca de nosotros</h1>

      
        <div className="mb-5">
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'center' }}>
            Somos una empresa <strong>100% nacional</strong>, con más de <strong>40 años</strong> de trayectoria en la comercialización de calzado, indumentaria y artículos deportivos. <br />
            Contamos con más de <strong>560 colaboradores</strong>, <strong>26 sucursales</strong> y a través de nuestro E-commerce llegamos a satisfacer la demanda de nuestros clientes en todo el país. <br />
            Ofrecemos las <strong>mejores marcas</strong>, el más amplio stock y atención personalizada en nuestros locales. <br />
            Nuestra marca es un clásico que acompaña día a día la pasión de los argentinos. <br />
            <strong>¡Gracias por tu visita!</strong>
          </p>
        </div>


        <div className="d-flex justify-content-center">
          <iframe
            title="Ubicación de nuestra sucursal"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d746.8474204295984!2d-65.40066952932105!3d-27.0735803732219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1753815815785!5m2!1ses-419!2sar"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              width: '100%',
              maxWidth: '600px',
              height: '300px',
              border: '0',
              borderRadius: '8px',
            }}
          ></iframe>
        </div>
      </Container>
      <ComentariosClientes />

    </>



  )
}
export default Nosotros