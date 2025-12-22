import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

export default function PromoModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenPromo = sessionStorage.getItem("hasSeenPromo");

    if (!hasSeenPromo && window.innerWidth >= 992) {
      setShow(true);
      sessionStorage.setItem("hasSeenPromo", "true");

      
      const timer = setTimeout(() => {
        setShow(false);
      }, 5000);

     
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>¡Promoción especial!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="alert alert-success text-center">
          🚚 Envío gratis desde los $200000
        </div>
      </Modal.Body>
    </Modal>
  );
}
