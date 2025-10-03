import React from 'react';


const MiniaturasCarrusel = ({ imagenes, selectedIndex, onSelect }) => {
  return (
    <div className="miniaturas-wrapper">


      {imagenes.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Miniatura ${index + 1}`}
          className={`miniatura-img ${selectedIndex === index ? 'selected' : ''}`}
          onClick={() => onSelect(index)}
        />
      ))}
    </div>


  );
};

export default MiniaturasCarrusel;

