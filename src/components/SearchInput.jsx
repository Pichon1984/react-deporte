import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchInput() {
  const [searchValue, setSearchValue] = useState(''); // 👈 inicializamos con string vacío
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim() !== '') {
      // 👇 normalizamos a minúsculas para que coincida con la base
      navigate(`/categoria/${searchValue.toLowerCase()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex">
      <input
        type="text"
        placeholder="Buscar categoría..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="form-control me-2"
      />
      <button type="submit" className="btn btn-outline-light">
        Buscar
      </button>
    </form>
  );
}

export default SearchInput;




