import React from "react";
import { Image } from "react-bootstrap";

const MiniaturasCarrusel = ({ imagenes, selectedIndex, onSelect }) => {
  const miniaturas = imagenes.slice(0, 4); 

  return (
    <div className="d-flex flex-wrap justify-content-center gap-2">
      {miniaturas.map((img, index) => (
        <Image
          key={index}
          src={img}
          alt={`Miniatura ${index + 1}`}
          thumbnail
          style={{
            width: "70px",
            height: "70px",
            objectFit: "contain",
            cursor: "pointer",
            border: selectedIndex === index ? "2px solid #007bff" : "1px solid #ccc"
          }}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>
  );
};

export default MiniaturasCarrusel;


