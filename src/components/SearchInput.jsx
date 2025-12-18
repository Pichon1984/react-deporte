import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, Button } from "react-bootstrap";

const SearchInput = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/buscar?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <Form className="d-flex ms-3" onSubmit={handleSubmit}>
      <FormControl
        type="search"
        placeholder="Buscar productos..."
        className="me-2"
        aria-label="Buscar"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button type="submit" variant="outline-light">
        Buscar
      </Button>
    </Form>
  );
};

export default SearchInput;
