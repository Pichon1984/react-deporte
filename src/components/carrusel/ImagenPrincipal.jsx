import React from "react";
import { Image } from "react-bootstrap";

const ImagenPrincipal = ({ imagen }) => {
  return (
    <div className="text-center">
      <Image
        src={imagen}
        alt="Imagen principal"
        fluid
        style={{ maxHeight: "400px", objectFit: "contain" }}
      />
    </div>
  );
};

export default ImagenPrincipal;



