import React from 'react';

const ImagenPrincipal = ({ imagen }) => {
  return (
    <div className="rounded shadow-sm p-3 text-center">
      <img
        src={imagen}
        alt="Vista seleccionada"
        className="img-fluid"
        style={{ maxHeight: '400px', objectFit: 'contain' }}
      />
    </div>
  );
};

export default ImagenPrincipal;



