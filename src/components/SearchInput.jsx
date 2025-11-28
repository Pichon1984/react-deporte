
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Form, FormControl, Button } from 'react-bootstrap';


const SearchInput = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); 

  const handleSearch = (e) => {
    e.preventDefault(); 
    if (searchTerm.trim()) { 
      navigate(`/search?q=${searchTerm.trim()}`); 
      setSearchTerm(''); 
    }
  };

  return (
    <Form onSubmit={handleSearch} className="d-flex">
      <FormControl 
        type="search"
        placeholder="Buscar..."
        className="me-2" 
        aria-label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button type="submit" variant="outline-light"> {}
        Buscar
      </Button>
    </Form>
  );
};

export default SearchInput;